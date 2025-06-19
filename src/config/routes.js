import Game from '@/components/pages/Game';

export const routes = {
  game: {
    id: 'game',
    label: 'Game',
    path: '/',
    icon: 'Target',
    component: Game
  }
};

export const routeArray = Object.values(routes);
export default routes;