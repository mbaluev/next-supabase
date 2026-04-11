'use client';

import React, {
  ComponentProps,
  createContext,
  ComponentRef,
  forwardRef,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import { MEDIA_MD, useMatchMedia } from '@/hooks/use-match-media';
import { Button } from '@/components/ui/button';
import { ArrowLeftFromLine, ArrowRightToLine } from 'lucide-react';
import { useCookies } from 'next-client-cookies';
import { TRouteDTO } from '@/settings/routes';
import { useWindowResize } from '@/hooks/use-window-resize';
import { CTree, TTreeDTO } from '@/utils/tree';
import { usePathname } from 'next/navigation';
import { useSidebarLeft } from '@/components/layout/sidebar-left';

const SIDEBAR_STORAGE_NAME = 'sidebar-right';
const SIDEBAR_KEYBOARD_SHORTCUT = 'h';
const SIDEBAR_TRANSITION_DURATION = 200;
const SIDEBAR_EVENT_START = 'sidebar-right-start';
const SIDEBAR_EVENT_END = 'sidebar-right-end';
const SIDEBAR_WIDTH_MIN = 260;
const SIDEBAR_WIDTH_MAX = 480;

interface SidebarRightContext<T> {
  name?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  toggleNode: (node: TTreeDTO<T>) => void;
  data?: CTree<T>;
  // resizing
  handleResize: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  resizing: boolean;
  width: number;
}
const SidebarRightContext = createContext<SidebarRightContext<TRouteDTO> | null>(null);
function useSidebarRight() {
  const context = useContext(SidebarRightContext);
  if (!context) throw new Error('useSidebarRight must be used within a SidebarRight.');
  return context;
}

type SidebarRightProviderBaseProps = {
  data?: CTree<TRouteDTO>;
  name?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  collapsed?: boolean;
};
type SidebarRightProviderProps = ComponentProps<'div'> & SidebarRightProviderBaseProps;
const SidebarRightProvider = forwardRef<HTMLDivElement, SidebarRightProviderProps>((props, ref) => {
  const { name = SIDEBAR_STORAGE_NAME, defaultOpen: __defaultOpen } = props;
  const cookies = useCookies();
  let _defaultOpen: any = cookies.get(name);
  _defaultOpen = _defaultOpen ? _defaultOpen === 'true' : __defaultOpen;

  const {
    data: initData,
    name: _name,
    open: openProp,
    onOpenChange: setOpenProp,
    defaultOpen,
    collapsed,
    className,
    children,
    ..._props
  } = props;
  const isMobile = useMatchMedia(MEDIA_MD);
  const [openMobile, setOpenMobile] = useState(false);
  const pathname = usePathname();

  // internal state of the sidebar.
  const [_open, _setOpen] = useState(_defaultOpen ?? defaultOpen);
  const open = openProp ?? _open;
  const setOpenCallback = (value: boolean | ((value: boolean) => boolean)) => {
    const res = typeof value === 'function' ? value(open) : value;
    if (setOpenProp) return setOpenProp?.(res);
    cookies.set(name || SIDEBAR_STORAGE_NAME, String(res));
    _setOpen(value);
  };
  const setOpen = useCallback(setOpenCallback, [setOpenProp, open, cookies]);

  // toggle the sidebar.
  const toggleCallback = () => {
    window.dispatchEvent(new Event(SIDEBAR_EVENT_START));
    setTimeout(() => {
      window.dispatchEvent(new Event(SIDEBAR_EVENT_END));
    }, SIDEBAR_TRANSITION_DURATION * 2);
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  };
  const toggleSidebar = useCallback(toggleCallback, [isMobile, setOpen, setOpenMobile]);

  // keyboard shortcut to toggle/hide the sidebar.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  // init data
  const [data, setData] = useState<CTree<TRouteDTO>>(initData ?? new CTree());
  const toggleNodeCallback = (node: TTreeDTO<TRouteDTO>) => {
    const _data = data.clone();
    _data.toggle(node.id);
    setData(_data);
  };
  const toggleNode = useCallback(toggleNodeCallback, []);
  useEffect(() => {
    const _data = data.clone();
    if (collapsed) _data.collapseTo(1);
    setData(_data);
  }, [collapsed]);
  useEffect(() => {
    const _data = data.clone();
    const node = _data.find((d) => d.data?.path === pathname);
    if (node) _data.select(node.id, true);
    else _data.deselect();
    setData(_data);
  }, [pathname]);

  // sidebar ref
  const sidebarRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => sidebarRef.current as HTMLDivElement);

  // resizing
  const SIDEBAR_RESIZE_NAME = `${name}_width`;
  let _defaultWidth: any = cookies.get(SIDEBAR_RESIZE_NAME);
  _defaultWidth = _defaultWidth ? Number(_defaultWidth) : SIDEBAR_WIDTH_MIN;
  const [width, setWidth] = useState(_defaultWidth);
  const [resizing, setResizing] = useState(false);
  const isResizingRef = useRef(false);
  const handleResize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    isResizingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) {
      setResizing(false);
      return;
    }
    const _offset = sidebarRef.current?.getBoundingClientRect().x ?? 0;
    const _width = sidebarRef.current?.getBoundingClientRect().width ?? 0;
    let newWidth = _width - e.clientX + _offset;
    if (newWidth < SIDEBAR_WIDTH_MIN) newWidth = SIDEBAR_WIDTH_MIN;
    if (newWidth > SIDEBAR_WIDTH_MAX) newWidth = SIDEBAR_WIDTH_MAX;
    setWidth(newWidth);
    cookies.set(SIDEBAR_RESIZE_NAME, String(newWidth));
  };
  const handleMouseUp = () => {
    isResizingRef.current = false;
    setResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // context value
  const contextValueMemo = (): SidebarRightContext<TRouteDTO> => ({
    name,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar,
    toggleNode,
    data,
    handleResize,
    resizing,
    width,
  });
  const contextValue = useMemo<SidebarRightContext<TRouteDTO>>(contextValueMemo, [
    name,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar,
    toggleNode,
    data,
    handleResize,
    resizing,
    width,
  ]);

  return (
    <SidebarRightContext.Provider value={contextValue}>
      <div
        id={name}
        className={cn('flex flex-grow min-h-full', className)}
        ref={sidebarRef}
        {..._props}
      >
        {children}
      </div>
    </SidebarRightContext.Provider>
  );
});
SidebarRightProvider.displayName = 'SidebarRightProvider';

type SidebarRightTriggerProps = ComponentProps<typeof Button>;
const SidebarRightTrigger = forwardRef<ComponentRef<typeof Button>, SidebarRightTriggerProps>(
  (props, ref) => {
    const { onClick, ..._props } = props;
    const { toggleSidebar, open, isMobile, openMobile } = useSidebarRight();
    if (!isMobile && open) return null;
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        onClick={(event) => {
          onClick?.(event);
          toggleSidebar();
        }}
        {..._props}
      >
        {!(isMobile ? openMobile : open) && <ArrowLeftFromLine />}
        {(isMobile ? openMobile : open) && <ArrowRightToLine />}
      </Button>
    );
  }
);
SidebarRightTrigger.displayName = 'SidebarRightTrigger';

type SidebarRightButtonProps = ComponentProps<typeof Button>;
const SidebarRightButton = forwardRef<ComponentRef<typeof Button>, SidebarRightButtonProps>(
  (props, ref) => {
    const { onClick, children, className, ...rest } = props;
    const { toggleSidebar, isMobile } = useSidebarRight();
    const handleClick = (e: any) => {
      if (onClick) onClick(e);
      if (isMobile) toggleSidebar();
    };
    return (
      <Button ref={ref} onClick={handleClick} className={cn('justify-start', className)} {...rest}>
        {children}
      </Button>
    );
  }
);
SidebarRightButton.displayName = 'SidebarRightButton';

type SidebarRightBaseProps = {};
type SidebarRightProps = ComponentProps<'nav'> & SidebarRightBaseProps;
const SidebarRight = forwardRef<HTMLDivElement, SidebarRightProps>((props, ref) => {
  const { className, children, ..._props } = props;
  const { isMobile, open, openMobile, toggleSidebar } = useSidebarRight();
  const { width: windowWidth } = useWindowResize();
  const { width, resizing } = useSidebarRight();
  const isDesktop = useMemo(() => !isMobile, [isMobile]);

  const classNavDesktop = cn('h-full flex-grow-0 flex-shrink-0 flex-basis-auto static'); // 'w-[280px]', !open && 'mr-[-280px]'
  const classNavMobile = cn(
    'w-[calc(100%-12px)] max-w-[300px] fixed top-0 bottom-0 z-[10]',
    openMobile && windowWidth > 312 && 'right-0 left-[calc(100%-300px)]',
    openMobile && windowWidth <= 312 && 'right-0 left-auto',
    !openMobile && 'right-[-100%] left-[100%]'
  );
  const classNav = cn(
    'relative',
    !resizing && `transition-all duration-${SIDEBAR_TRANSITION_DURATION}`,
    isMobile ? classNavMobile : classNavDesktop,
    className
  );

  const classDivMobile = cn('shadow-md rounded-l-lg');
  const classDivDesktop = cn('fixed'); // 'w-[280px]'
  const classDiv = cn(
    'bg-sidebar text-sidebar-foreground h-full flex flex-col',
    isMobile ? classDivMobile : classDivDesktop
  );

  const classBackdrop = cn('fixed top-0 left-0 w-full h-full z-[9] bg-black/25');

  return (
    <Fragment>
      <nav
        className={classNav}
        ref={ref}
        style={{
          width: isDesktop ? width : undefined,
          marginRight: isDesktop && !open ? -width : undefined,
        }}
        {..._props}
      >
        <div className={classDiv} style={{ width: isDesktop ? width : undefined }}>
          {children}
        </div>
      </nav>
      {isMobile && openMobile && <div className={classBackdrop} onClick={toggleSidebar} />}
    </Fragment>
  );
});
SidebarRight.displayName = 'SidebarRight';

type SidebarRightResizeProps = ComponentProps<'div'>;
const SidebarRightResize = forwardRef<HTMLDivElement, SidebarRightResizeProps>((props, ref) => {
  const { className, children, ...rest } = props;
  const { handleResize } = useSidebarRight();
  const { isMobile } = useSidebarLeft();
  const classResize = cn(
    'absolute top-0 left-0 bottom-0 w-1 opacity-0',
    'bg-secondary active:bg-primary z-1 cursor-col-resize',
    className
  );
  if (isMobile) return null;
  return <div ref={ref} className={classResize} onMouseDown={handleResize} {...rest} />;
});
SidebarRightResize.displayName = 'SidebarRightResize';

export {
  SidebarRightProvider,
  SidebarRight,
  SidebarRightTrigger,
  SidebarRightButton,
  SidebarRightResize,
  useSidebarRight,
  SIDEBAR_EVENT_START,
  SIDEBAR_EVENT_END,
};
