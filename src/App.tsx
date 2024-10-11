import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Box } from '@mui/material';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Alert, Snackbar } from '@mui/material';
interface User {
  id: number;
  name: string;
  role?: Role;
}

interface Role {
  id: number;
  name: string;
}

const ManageRoles: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Liste des utilisateurs
  const [roles, setRoles] = useState<Role[]>([]); // Liste des rôles
  const [selectedUserId, setSelectedUserId] = useState<number | ''>(''); // Utilisateur sélectionné
  const [selectedRoleId, setSelectedRoleId] = useState<number | ''>(''); // Rôle sélectionné
  const [newRoleName, setNewRoleName] = useState<string>(''); // Nouveau rôle
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openAlert, setOpenAlert] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [alertMessage, setAlertMessage] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  // Charger les utilisateurs et les rôles
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
        console.log('Les donnees utilisateurs',response.data); // Vérifie le format de la réponse
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('Erreur : les données des utilisateurs ne sont pas au format tableau');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs', error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/roles`);
        console.log('les donnees des roles :')
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          console.error('Erreur : les données des rôles ne sont pas au format tableau');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des rôles', error);
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  // Créer un nouveau rôle
  const handleCreateRole = async () => {
    if (newRoleName.trim() === '') {
      alert('Le nom du rôle est requis');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/roles/create`, { name: newRoleName });
      setRoles((prevRoles) => [...prevRoles, response.data]);
      setNewRoleName(''); // Réinitialiser le champ du rôle
      //alert('Rôle créé avec succès');
      setAlertMessage('Role cree avec succès!');
      setAlertSeverity('success');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/roles`);
      setRoles(res.data); // Actualiser la liste des roles
    } catch (error) {
      console.error('Erreur lors de la création du rôle', error);
     // alert('Erreur lors de la création du rôle.');
     setAlertMessage('Erreur lors de l\'envoi des données.');
     setAlertSeverity('error')
    }
    setOpenAlert(true);
  };

  // Assigner un rôle à un utilisateur
  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRoleId) {
      alert('Sélectionnez un utilisateur et un rôle');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/${selectedUserId}/assign-role`, { role_id: selectedRoleId });
      //alert('Rôle assigné avec succès');
      setAlertMessage('Rôle assigné avec succès');
      setAlertSeverity('success');
      setSelectedUserId(''); // Réinitialiser les sélections
      setSelectedRoleId('');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      setUsers(response.data); // Actualiser la liste des utilisateurs
    } catch (error) {
      console.error('Erreur lors de l\'assignation du rôle', error);
      //alert('Erreur lors de l\'assignation du rôle.');
    }
    setOpenAlert(true);
  };

  // Révoquer un rôle d'un utilisateur
  const handleRevokeRole = async (userId: number) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/${userId}/revoke-role`);
      //alert('Rôle révoqué avec succès');
      setAlertMessage('Rôle révoqué avec succès');
      setAlertSeverity('success');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      setUsers(response.data); // Actualiser la liste des utilisateurs
    } catch (error) {
      console.error('Erreur lors de la révocation du rôle', error);
      alert('Erreur lors de la révocation du rôle.');
    }
    setOpenAlert(true);
  };

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
      >
        <Typography variant="h4" gutterBottom>
          Gestion des rôles d'utilisateur
        </Typography>

        {/* Formulaire de création de rôle */}
        <Box mb={3} width="100%">
          <Typography variant="h6" gutterBottom>Créer un nouveau rôle</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nom du rôle"
                variant="outlined"
                fullWidth
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button variant="contained" color="success" onClick={handleCreateRole} fullWidth>
                Créer le rôle
              </Button>
            </Grid>
          </Grid>
        </Box>
        {/* Formulaire pour assigner un rôle */}
        <Box mb={3} width="100%">
          <Typography variant="h6" gutterBottom>Assigner un rôle</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Utilisateur</InputLabel>
                <Select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(Number(e.target.value))}
                  label="Utilisateur"
                >
                  <MenuItem value="">Sélectionner un utilisateur</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Rôle</InputLabel>
                <Select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                  label="Rôle"
                >
                  <MenuItem value="">Sélectionner un rôle</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="success" onClick={handleAssignRole} fullWidth>
                Assigner le rôle
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Tableau des utilisateurs et de leurs rôles */}
        <Typography variant="h6" gutterBottom>Liste des utilisateurs et leurs rôles</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Utilisateurs</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.role ? user.role.name : 'Aucun rôle'}</TableCell>
                    <TableCell>
                      {user.role && (
                        <Button variant="contained" color="error" onClick={() => handleRevokeRole(user.id)}>
                          Révoquer le rôle
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>Aucun utilisateur trouvé</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageRoles;
