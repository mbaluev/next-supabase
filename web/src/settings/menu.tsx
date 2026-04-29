import { CTree } from '@/utils/tree';
import { TRouteDTO, ROUTES } from '@/settings/routes';

const menuLeft = new CTree<TRouteDTO>();
menuLeft.insert(ROUTES.DASHBOARD.name, menuLeft.root.id, { ...ROUTES.DASHBOARD });
menuLeft.insert(ROUTES.DEBUG.name, menuLeft.root.id, { ...ROUTES.DEBUG });
menuLeft.insert(ROUTES.DEBUG_LIST_STATIC.name, ROUTES.DEBUG.name, { ...ROUTES.DEBUG_LIST_STATIC });
menuLeft.insert(ROUTES.DEBUG_LIST_LOAD.name, ROUTES.DEBUG.name, { ...ROUTES.DEBUG_LIST_LOAD });
menuLeft.insert(ROUTES.DEBUG_XXX.name, ROUTES.DEBUG.name, { ...ROUTES.DEBUG_XXX });

export { menuLeft };
