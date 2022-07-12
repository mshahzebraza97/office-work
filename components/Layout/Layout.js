import React from 'react'
import NavBar from './NavBar'
import Head from 'next/head';
import { Box, Container, Grid, Paper } from '@mui/material';
import { concatStrings } from '../../helpers/reusable';
import Header from './Header';

import { useRouter } from "next/router"

// TODO: Implement Lazy Loading using "Next/Dynamic" and Dynamic Imports 
export default function Layout({ children }) {
    const router = useRouter()
    const theme = 'light';
    const faviconPathPrefix = `/favicons/AIMS/${theme}`;

    return (
        <>
            <Head>
                <title>AIMS - Assembly's Inventory Management System</title>
                <meta name="description" content="created for record keeping of inventory and tracking product history" />
                <meta name="author" content="M Shahzeb Raza" />
                {/* Favicon */}
                <link rel="apple-touch-icon" sizes="180x180" href={`${faviconPathPrefix}/apple-touch-icon.png`} />
                <link rel="icon" type="image/png" sizes="32x32" href={`${faviconPathPrefix}/favicon-32x32.png`} />
                <link rel="icon" type="image/png" sizes="16x16" href={`${faviconPathPrefix}/favicon-16x16.png`} />
                <link rel="manifest" href={`${faviconPathPrefix}/site.webmanifest`} />
            </Head>

            <Grid container  >
                <NavBar />
                <Grid item xs>
                    <Container maxWidth="xl" disableGutters>
                        <Header title={getHeaderTitle(router.pathname)} />
                        {children}
                    </Container>
                </Grid>
            </Grid>
        </>
    )
}


function getHeaderTitle(route) {
    switch (route) {
        case '/':
            return 'Home'
        case '/po':
            return 'Purchase Orders'
        case '/wo':
            return 'Work Orders'
        case '/module':
            return 'Modules'
        case '/project':
            return 'Projects'
        case '/transaction':
            return 'Transactions'
        case '/about':
            return 'About'
        case '/contact':
            return 'Contact'
        default:
            return '404'
    }
}