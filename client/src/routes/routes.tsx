import { Navigate, RouteObject } from "react-router-dom";
import Chat from "../components/pages/Chat";
import Contacts from "../components/pages/Contacts";
import Groups from "../components/pages/Groups";
import Main from "../components/pages/Main";
import Settings from "../components/pages/Settings";

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <div>Main default</div>
      },
      {
        path: 'groups',
        element: <Groups />
      },
      {
        path: 'contacts',
        element: <Contacts />
      },
      {
        path: 'settings',
        element: <Settings />
      },
    ]
  },
  {
    path: 'chat',
    element: <Chat />
  }
];