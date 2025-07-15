export class App {
    name: string;
    route: string;
    icon: string;
    unicon?: string;
    permission?: string; //Si tiene permisos se motrara/oculatara dependiendo de los permisos que el usuario tenga asignado
    hideHome?: boolean; //Si es verdadero ocultara el elemento que dirige a raiz, en la lista que aparece en los modulos con hijos (la raiz es la ruta de la aplicación padre)
    isHub?: boolean; //Si es verdadero solo mostrara la aplicación en el HUB cuando tenga al menos un hijo activo, de lo contario se ocultara, si es falso siempre estara presente en el HUB (tomando encuenta los permisos asignados) sin importar si tiene hijos o no activos
    children?: App[]; //Lista de modulos y componentes hijos de la aplicación
    apps?: App[]; //Hub secundario de apps
    menu?: Menu[];
}

export class Menu {
    name: string;
    identificador?: string;
    icon?: string;
    permission?: string; //Si tiene permisos se motrara/oculatara dependiendo de los permisos que el usuario tenga asignado
    children: App[]
}

export const APPS: App[] = [
    {
        name: 'Herramientas Dev', route: "dev-tools", icon: "assets/icons/dev-tools.svg", isHub: true, hideHome: true, permission: "6ARHQGj1N8YPkr02DY04K1Zy7HjIdDcj",
        menu: [
            {
                name: 'Tools',
                icon: 'settings',
                identificador: 'tools',
                children: [
                    { name: 'Log de Excepciones', route: 'dev-tools/sys-log-errors', icon: 'report' },
                    { name: 'Reportes MySQL', route: 'dev-tools/mysql-reportes', icon: 'insert_drive_file' },
                ]
            },
        ],
    },
    {
        name: 'Control de Acceso', route: "control-acceso", icon: "assets/icons/control-acceso.svg", permission: "hr5UhgMTDmF9EiLYeq5x0cz0e281IWRU",
        menu: [
            {
                name: 'Administrar',
                icon: 'menu_open',
                identificador: 'administracion',
                children: [
                    { name: "Usuarios", route: "control-acceso/usuarios", icon: "manage_accounts", permission: "hr5UhgMTDmF9EiLYeq5x0cz0e281IWRU" },
                    { name: 'Roles', route: "control-acceso/roles", icon: "groups_2", permission: "gzA7BboE1BpzXZmko6OIDT3EOQRn4otm" },
                ]
            },
            {
                name: 'Config',
                icon: 'admin_panel_settings',
                identificador: 'configuracion',
                children: [
                    { name: 'Permisos', route: "control-acceso/permisos", icon: "key", permission: "tTVayONYIDylH9dk7jg5143h0FKoSpBi" },
                ]
            }
        ]
    },
    {
        name: 'INFORMACIÓN', route: "informacion", icon: "assets/icons/informacion.png", permission: "rdhSQ68TQgDiUY6xbR1zXyzW55IdFhee",
    },
    {
        name: 'DAHSBOARD', route: "dashboard", icon: "assets/icons/reportes.jpg", permission: "YPizS0t9mHsg7licGlGiGUxlXhztHKGw",
    }

]