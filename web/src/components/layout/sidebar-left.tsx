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
import { ArrowLeftToLine, ArrowRightFromLine } from 'lucide-react';
import { CTree, TTreeDTO } from '@/utils/tree';
import { usePathname } from 'next/navigation';
import { TRouteDTO } from '@/settings/routes';

const SIDEBAR_STORAGE_NAME = 'sidebar-left';
const SIDEBAR_KEYBOARD_SHORTCUT = 'g';
const SIDEBAR_TRANSITION_DURATION = 200;
const SIDEBAR_EVENT_START = 'sidebar-left-start';
const SIDEBAR_EVENT_END = 'sidebar-left-end';
const SIDEBAR_WIDTH_MIN = 260;
const SIDEBAR_WIDTH_MAX = 480;

interface SidebarLeftContext<T> {
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
const SidebarLeftContext = createContext<SidebarLeftContext<TRouteDTO> | null>(null);
function useSidebarLeft() {
  const context = useContext(SidebarLeftContext);
  if (!context) throw new Error('useSidebarLeft must be used within a SidebarLeft.');
  return context;
}

type SidebarLeftProviderBaseProps = {
  data?: CTree<TRouteDTO>;
  name?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  collapsed?: boolean;
};
type SidebarLeftProviderProps = ComponentProps<'div'> & SidebarLeftProviderBaseProps;
const SidebarLeftProvider = forwardRef<HTMLDivElement, SidebarLeftProviderProps>((props, ref) => {
  const { name = SIDEBAR_STORAGE_NAME, defaultOpen: __defaultOpen } = props;
  let _defaultOpen: string | null =
    typeof window !== 'undefined' ? localStorage.getItem(name) : null;
  const _parsedOpen = _defaultOpen != null ? _defaultOpen === 'true' : __defaultOpen;

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
  const [_open, _setOpen] = useState<boolean>(
    (_parsedOpen ?? defaultOpen) ?? false,
  );
  const open = openProp ?? _open;
  const setOpenCallback = (value: boolean | ((value: boolean) => boolean)) => {
    const res = typeof value === 'function' ? value(open) : value;
    if (setOpenProp) return setOpenProp?.(res);
    localStorage.setItem(name, String(res));
    _setOpen(res);
  };
  const setOpen = useCallback(setOpenCallback, [setOpenProp, open, name]);

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
  const _storedWidth =
    typeof window !== 'undefined' ? localStorage.getItem(SIDEBAR_RESIZE_NAME) : null;
  const _defaultWidth = _storedWidth ? Number(_storedWidth) : SIDEBAR_WIDTH_MIN;
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
    let newWidth = e.clientX - _offset;
    if (newWidth < SIDEBAR_WIDTH_MIN) newWidth = SIDEBAR_WIDTH_MIN;
    if (newWidth > SIDEBAR_WIDTH_MAX) newWidth = SIDEBAR_WIDTH_MAX;
    setWidth(newWidth);
    localStorage.setItem(SIDEBAR_RESIZE_NAME, String(newWidth));
  };
  const handleMouseUp = () => {
    isResizingRef.current = false;
    setResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // context value
  const contextValueMemo = (): SidebarLeftContext<TRouteDTO> => ({
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
  const contextValue = useMemo<SidebarLeftContext<TRouteDTO>>(contextValueMemo, [
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
    <SidebarLeftContext.Provider value={contextValue}>
      <div id={name} className={cn('flex grow min-h-full', className)} ref={sidebarRef} {..._props}>
        {children}
      </div>
    </SidebarLeftContext.Provider>
  );
});
SidebarLeftProvider.displayName = 'SidebarLeftProvider';

type SidebarLeftTriggerProps = ComponentProps<typeof Button>;
const SidebarLeftTrigger = forwardRef<ComponentRef<typeof Button>, SidebarLeftTriggerProps>(
  (props, ref) => {
    const { onClick, ..._props } = props;
    const { toggleSidebar, open, isMobile, openMobile } = useSidebarLeft();
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
        {!(isMobile ? openMobile : open) && <ArrowRightFromLine />}
        {(isMobile ? openMobile : open) && <ArrowLeftToLine />}
      </Button>
    );
  }
);
SidebarLeftTrigger.displayName = 'SidebarLeftTrigger';

type SidebarLeftButtonProps = ComponentProps<typeof Button>;
const SidebarLeftButton = forwardRef<ComponentRef<typeof Button>, SidebarLeftButtonProps>(
  (props, ref) => {
    const { onClick, children, className, ...rest } = props;
    const { toggleSidebar, isMobile } = useSidebarLeft();
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
SidebarLeftButton.displayName = 'SidebarLeftButton';

type SidebarLeftBaseProps = {};
type SidebarLeftProps = ComponentProps<'nav'> & SidebarLeftBaseProps;
const SidebarLeft = forwardRef<HTMLDivElement, SidebarLeftProps>((props, ref) => {
  const { className, children, ..._props } = props;
  const { isMobile, open, openMobile, toggleSidebar } = useSidebarLeft();
  const { width, resizing } = useSidebarLeft();
  const isDesktop = useMemo(() => !isMobile, [isMobile]);

  const classNavDesktop = cn('h-full flex-grow-0 flex-shrink-0 flex-basis-auto static'); // 'w-[280px]', !open && 'ml-[-280px]'
  const classNavMobile = cn(
    'w-[calc(100%-12px)] max-w-[300px] fixed top-0 bottom-0 z-[10]',
    openMobile && 'left-0 right-4',
    !openMobile && 'left-[-100%] right-[100%]'
  );
  const classNav = cn(
    'relative',
    !resizing && `transition-all duration-${SIDEBAR_TRANSITION_DURATION}`,
    isMobile ? classNavMobile : classNavDesktop,
    className
  );

  const classDivMobile = cn('shadow-md rounded-r-lg');
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
          marginLeft: isDesktop && !open ? -width : undefined,
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
SidebarLeft.displayName = 'SidebarLeft';

type SidebarLeftResizeProps = ComponentProps<'div'>;
const SidebarLeftResize = forwardRef<HTMLDivElement, SidebarLeftResizeProps>((props, ref) => {
  const { className, children, ...rest } = props;
  const { handleResize } = useSidebarLeft();
  const { isMobile } = useSidebarLeft();
  const classResize = cn(
    'absolute top-0 right-0 bottom-0 w-1 opacity-0',
    'bg-secondary active:bg-primary z-1 cursor-col-resize',
    className
  );
  if (isMobile) return null;
  return <div ref={ref} className={classResize} onMouseDown={handleResize} {...rest} />;
});
SidebarLeftResize.displayName = 'SidebarLeftResize';

export {
  SidebarLeftProvider,
  SidebarLeft,
  SidebarLeftTrigger,
  SidebarLeftButton,
  SidebarLeftResize,
  useSidebarLeft,
  SIDEBAR_EVENT_START,
  SIDEBAR_EVENT_END,
};
