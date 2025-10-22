import React, { useEffect } from 'react'
import { Box, Button, Paper, Stack, Typography, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { getAllUsersAsync, selectUsers, selectUsersFetchStatus, selectUserToggleStatus, toggleUserStatusAsync } from '../../user/UserSlice'
import { toast } from 'react-toastify'
import Lottie from 'lottie-react'
import { loadingAnimation } from '../../../assets'

export const AdminUsers = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const users = useSelector(selectUsers)
  const usersFetchStatus = useSelector(selectUsersFetchStatus)
  const userToggleStatus = useSelector(selectUserToggleStatus)

  useEffect(() => {
    dispatch(getAllUsersAsync())
  }, [dispatch])

  useEffect(() => {
    if (userToggleStatus === 'fulfilled') {
      toast.success("User status updated successfully")
    } else if (userToggleStatus === 'rejected') {
      toast.error("Failed to update user status")
    }
  }, [userToggleStatus])

  const handleToggleStatus = (userId) => {
    dispatch(toggleUserStatusAsync(userId))
  }

  const columns = [
    { field: '_id', headerName: 'ID', width: 220 },
    { field: 'name', headerName: 'Name', width: 170 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'isAdmin', headerName: 'Admin', width: 130, 
      renderCell: (params) => (
        <Typography>{params.row.isAdmin ? 'Yes' : 'No'}</Typography>
      )
    },
    { field: 'isEnabled', headerName: 'Status', width: 130,
      renderCell: (params) => (
        <Typography color={params.row.isEnabled ? 'green' : 'error'}>
          {params.row.isEnabled ? 'Enabled' : 'Disabled'}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button 
          variant="contained"
          color={params.row.isEnabled ? 'error' : 'success'}
          onClick={() => handleToggleStatus(params.row._id)}
        >
          {params.row.isEnabled ? 'Disable' : 'Enable'}
        </Button>
      ),
    },
  ]

  if (usersFetchStatus === 'pending') {
    return (
      <Stack width={'100%'} height={'calc(100vh - 4rem)'} justifyContent={'center'} alignItems={'center'}>
        <Box width={'25rem'}>
          <Lottie animationData={loadingAnimation} />
        </Box>
      </Stack>
    )
  }

  return (
    <Stack p={3}>
      <Typography variant="h4" fontWeight={500} mb={3}>User Management</Typography>
      <Paper elevation={3} sx={{ height: 'calc(100vh - 12rem)', width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </Paper>
    </Stack>
  )
}
