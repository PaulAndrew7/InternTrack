import React, { useContext } from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';

const images = [
  "https://cdn.magicdecor.in/com/2023/10/20174720/Anime-Scenery-Wallpaper-for-Walls.jpg",
  "https://m.media-amazon.com/images/I/71mgpWBEXHL.jpg",
  "https://backiee.com/static/wallpapers/560x315/209636.jpg"
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [currentImage, setCurrentImage] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar title="Student Dashboard" role="student" />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ position: 'relative', height: '50vh', overflow: 'hidden', mb: 4 }}>
          {images.map((image, index) => (
            <Box
              key={index}
              component="img"
              src={image}
              alt={`Slide ${index + 1}`}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: index === currentImage ? 1 : 0,
                transition: 'opacity 1s ease-in-out'
              }}
            />
          ))}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              p: 2
            }}
          >
            <Typography variant="h4">Welcome, {user.username}!</Typography>
            <Typography variant="body1">
              Manage your internship details and documents
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random?internship"
                alt="Internship"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Edit Your Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your internship information including company details, stipend, and duration.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random?documents"
                alt="Documents"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Upload Documents
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submit your internship documents such as offer letters, completion certificates, and reports.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random?status"
                alt="Status"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Track Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor your internship status and document submission progress.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;