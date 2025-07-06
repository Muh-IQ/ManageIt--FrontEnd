import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Header from './Header';
import Card from '@mui/material/Card';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import ProjectCard from './ProjectCard'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FetchFromAPI } from '../Utility/connection';
import SimpleCache from '../Utility/SimpleCache';

export default function Home() {
    const cache = new SimpleCache();
    const [projects, setProjects] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [countProjects, setCountProjects] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const pageSize = 10;

    const fetchProjects = async (page) => {
        if (isLoading) return;

        setIsLoading(true);

        const response = await FetchFromAPI(`Project/GetUserProjectsPaged?PageNumber=${page}&PageSize=${pageSize}`);
        const data = await response.json();

        if (projects.length + data.length >= countProjects) {
            setHasMore(false);
        }
        setProjects(prevProjects => [...prevProjects, ...data]);

        setIsLoading(false);
    };


    const fetchCountProjects = async () => {
        const response = await FetchFromAPI(`Project/GetCountUserProjects`);
        const data = await response.json();
        setCountProjects(+data);
    }

    useEffect(() => {
        cache.clearAllMemberData();
        fetchCountProjects();
    }, []);
    useEffect(() => {
        if (countProjects > 0) {
            fetchProjects(pageNumber);
        }
    }, [pageNumber, countProjects]);


    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasMore && !isLoading) {
            setPageNumber(prevPage => prevPage + 1);
        }
    };


    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    return (
        <React.Fragment>
            <Box sx={{ position: 'absolute', top: '0', left: '0', width: '100vw' }}>
                <Header />
            </Box>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ marginTop: '80px' }}>
                <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to={'/AddNewPoject'}>
                        <Card key={0}
                            sx={{
                                borderRadius: '12px',
                                minWidth: 275,
                                minHeight: 191,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <AddSharpIcon color="primary" sx={{ fontSize: 100, mr: 1, my: 0.5 }} />
                        </Card>
                    </Link>

                    {projects.map((proj, index) => (
                        <Link key={proj.projectsID} to={`/ProjectDetails?id=${proj.projectsID}&per=${proj.permission}`}>

                            <ProjectCard
                                key={proj.projectsID}
                                Name={proj.projectsName}
                                Status={proj.projectStatuseName}
                                Role={proj.permission}
                            />

                        </Link >

                    ))}

                    {!hasMore && (
                        <Box sx={{ width: '100%', textAlign: 'center', my: 2 }}>
                            <p>No more projects to load</p>
                        </Box>
                    )}
                </Box>
            </Container>
        </React.Fragment>
    );
}
