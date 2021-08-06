import { MenuItemConstructorOptions, shell } from 'electron'

export function buildMenu(opts = {
    repo: 'https://github.com/patarapolw/solfeggio',
    platform: process.platform
}) {
    const repo = opts.repo;
    const platform = opts.platform || process.platform;

    const isMac = platform === "darwin";

    const template = [
        ...(isMac
            ? [
                {
                    role: "appmenu",
                    submenu: [
                        { role: "about" },
                        { type: "separator" },
                        { role: "services" },
                        { type: "separator" },
                        { role: "hide" },
                        { role: "hideothers" },
                        { role: "unhide" },
                        { type: "separator" },
                        { role: "quit" },
                    ],
                },
            ]
            : []),
        {
            role: "filemenu",
            submenu: [isMac ? { role: "close" } : { role: "quit" }],
        },
        {
            role: "editmenu",
            submenu: [
                { role: "undo" },
                { role: "redo" },
                { type: "separator" },
                { role: "cut" },
                { role: "copy" },
                { role: "paste" },
                ...(isMac
                    ? [
                        { role: "pasteandmatchstyle" },
                        { role: "delete" },
                        { role: "selectall" },
                        { type: "separator" },
                        {
                            label: "Speech",
                            submenu: [
                                { role: "startspeaking" },
                                { role: "stopspeaking" },
                            ],
                        },
                    ]
                    : [
                        { role: "delete" },
                        { type: "separator" },
                        { role: "selectall" },
                    ]),
            ],
        },
        {
            role: "viewmenu",
            submenu: [
                { role: "reload" },
                { role: "forcereload" },
                { role: "toggledevtools" },
                { type: "separator" },
                { role: "resetzoom" },
                { role: "zoomin" },
                { role: "zoomout" },
                { type: "separator" },
                { role: "togglefullscreen" },
            ],
        },
        {
            role: "windowmenu",
            submenu: [
                { role: "minimize" },
                { role: "zoom" },
                ...(isMac
                    ? [
                        { type: "separator" },
                        { role: "front" },
                        //   { type: "separator" },
                        //   { role: "window" },
                    ]
                    : [{ role: "close" }]),
            ],
        },
        {
            role: "help",
            submenu: [
                {
                    label: "Learn More",
                    click: async () => {
                        await shell.openExternal(repo);
                    },
                },
                {
                    label: "Documentation",
                    click: async () => {
                        await shell.openExternal(`${repo}/wiki`);
                    },
                },
                {
                    label: "Community Discussions",
                    click: async () => {
                        await shell.openExternal(`${repo}/discussions`);
                    },
                },
                {
                    label: "Search Issues",
                    click: async () => {
                        await shell.openExternal(`${repo}/issues`);
                    },
                },
            ],
        },
    ] as MenuItemConstructorOptions[];

    return template;
};
