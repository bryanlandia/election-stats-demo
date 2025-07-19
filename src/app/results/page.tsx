import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  LinearProgress,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { blue, red, green } from '@mui/material/colors';

export default function ResultsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Election Results
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Presidential Election 2024
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    backgroundColor: blue[50],
                    border: `1px solid ${blue[200]}`
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" color={blue[800]}>
                        Candidate A (Democratic)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        81,000,000 votes
                      </Typography>
                    </Box>
                    <Typography variant="h4" color={blue[600]} fontWeight="bold">
                      51.3%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={51.3} 
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                </Paper>
                
                <Paper 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    backgroundColor: red[50],
                    border: `1px solid ${red[200]}`
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" color={red[800]}>
                        Candidate B (Republican)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        74,000,000 votes
                      </Typography>
                    </Box>
                    <Typography variant="h4" color={red[600]} fontWeight="bold">
                      46.8%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={46.8} 
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    color="secondary"
                  />
                </Paper>
                
                <Paper 
                  sx={{ 
                    p: 2, 
                    backgroundColor: green[50],
                    border: `1px solid ${green[200]}`
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" color={green[800]}>
                        Other Candidates
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        3,000,000 votes
                      </Typography>
                    </Box>
                    <Typography variant="h4" color={green[600]} fontWeight="bold">
                      1.9%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={1.9} 
                    sx={{ mt: 1, height: 8, borderRadius: 4, color: green[500] }}
                  />
                </Paper>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Total votes: 158,000,000
                </Typography>
                <Chip label="100% Reporting" color="success" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Key Statistics
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Voter Turnout" 
                    secondary="66.2%" 
                    slotProps={{
                      secondary: { fontWeight: 'bold' }
                    }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Eligible Voters" 
                    secondary="238,000,000" 
                    slotProps={{
                      secondary: { fontWeight: 'bold' }
                    }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="States Called" 
                    secondary="50/50" 
                    slotProps={{
                      secondary: { fontWeight: 'bold' }
                    }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Electoral Votes" 
                    secondary="312 - 226" 
                    slotProps={{
                      secondary: { fontWeight: 'bold' }
                    }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
