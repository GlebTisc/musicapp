"use client"

import { mainTheme } from "@/themes/theme";
import { Drawer, Toolbar, useMediaQuery } from "@mui/material";
import { useState } from "react";

interface HeaderDrawerProps {
    children: React.ReactNode;
    isDesktop: boolean;
    isOpen: boolean;
    onClose: () => void;
    onTransitionEnd: () => void;
}

const APP_BAR_HEIGHT = "48px";

export default function HeaderDrawer({children, isDesktop, isOpen, onClose, onTransitionEnd}:  HeaderDrawerProps)
{
    const drawerWidth = isDesktop 
        ? mainTheme.layout.drawer.width.desktop 
        : mainTheme.layout.drawer.width.mobile;

    return (isDesktop
        ? <Drawer
            variant="persistent" 
            open={isOpen}
            sx={{
                width: isOpen ? drawerWidth : 0,
                flexShrink: 0,
                transition: mainTheme.transitions.create('width', {
                    easing: mainTheme.transitions.easing.sharp,
                    duration: mainTheme.transitions.duration.leavingScreen,
                }),
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    position: 'fixed',
                    top: APP_BAR_HEIGHT,
                    height: `calc(100% - ${APP_BAR_HEIGHT})`,
                    overflowY: "auto",
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                },
            }}
            onTransitionEnd={onTransitionEnd}
        >
            {children}
        </Drawer>
        : <Drawer
            variant="temporary"
            open={isOpen}
            onClose={onClose}
            ModalProps={{keepMounted: true}}
            onTransitionEnd={onTransitionEnd}
            sx={{
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    top: APP_BAR_HEIGHT
                },
            }}
        >
            {children}
        </Drawer>
    );
}