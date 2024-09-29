// src/components/UserManagement.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/UserManagement.css'; // Import tệp CSS tùy chỉnh
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Giả sử vai trò của người dùng hiện tại được lưu trong localStorage
  const currentUserRole = localStorage.getItem('userRole'); // Lấy vai trò người dùng hiện tại

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/users');
        setUsers(response.data);
      } catch (err) {
        setError('Lỗi khi lấy thông tin người dùng.');
      }
    };

    fetchUsers();
  }, []);

  const handleHideUser = async userId => {
    try {
      const userToUpdate = users.find(user => user.CustomerID === userId);
      if (!userToUpdate) {
        setError('Không tìm thấy người dùng.');
        return;
      }

      const newStatus = !userToUpdate.IsActive; // Đảo ngược trạng thái IsActive
      await axios.patch(`http://localhost:4000/users/${userId}/hide`, { IsActive: newStatus });

      // Cập nhật lại danh sách người dùng
      setUsers(
        users.map(user =>
          user.CustomerID === userId ? { ...user, IsActive: newStatus } : user
        )
      );
      setSuccess(`Người dùng đã được ${newStatus ? 'hiện' : 'ẩn'} thành công.`);

      toast.success(`${newStatus ? 'Hiện' : 'Ẩn'} thành công!`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      setError('Lỗi khi ẩn người dùng.');
    }
  };

  const handleEditUser = userId => {
    navigate(`/admin/users/${userId}/edit`);
  };

  return (
    <div className="userManagement" style={{ padding: '50px' }}>
      <h2 style={{ textAlign: 'center', padding: '10px 0' }}>
        Danh sách người dùng
      </h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <Alert variant="success">{success}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Vai trò</th>
            <th>Hoạt động</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr
              key={user.CustomerID}
              className={user.IsActive ? '' : 'hidden-user'}
            >
              <td>{user.CustomerID}</td>
              <td>{`${user.FirstName} ${user.LastName}`}</td>
              <td>{user.Email}</td>
              <td>{user.Address}</td>
              <td>{user.Role}</td>
              <td>{user.IsActive ? 'Đang hoạt động' : 'Đã ẩn'}</td>
              <td>
                <Button
                  className="btn_edit"
                  onClick={() => handleEditUser(user.CustomerID)}
                >
                  Sửa
                </Button>
                {/* Nút Ẩn/Hiện chỉ hiển thị nếu người dùng không phải là admin */}
                {user.Role !== 'admin' && (
                  <Button
                    className="btn_hiddens"
                    style={{ marginLeft: '10px' }}
                    onClick={() => handleHideUser(user.CustomerID)}
                  >
                    {user.IsActive ? 'Ẩn' : 'Hiện'}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserManagement;

