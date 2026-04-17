import { CTree } from '@/utils/tree';
import { TRouteDTO, ROUTES } from '@/settings/routes';

const menuLeft = new CTree<TRouteDTO>();
menuLeft.insert(ROUTES.DASHBOARD.name, menuLeft.root.id, { ...ROUTES.DASHBOARD });
menuLeft.insert(ROUTES.FILES.name, menuLeft.root.id, { ...ROUTES.FILES });
menuLeft.insert(ROUTES.PARTNERS.name, menuLeft.root.id, { ...ROUTES.PARTNERS });
menuLeft.insert(ROUTES.USERS.name, menuLeft.root.id, { ...ROUTES.USERS });
menuLeft.insert(ROUTES.DEBUG.name, menuLeft.root.id, { ...ROUTES.DEBUG });
menuLeft.insert(ROUTES.ILLUSTRATIONS.name, menuLeft.root.id, { ...ROUTES.ILLUSTRATIONS });
menuLeft.insert(ROUTES.XXX.name, menuLeft.root.id, { ...ROUTES.XXX });

export { menuLeft };
