// import React, { useState } from 'react';
// import { Form, Button, Container } from 'react-bootstrap';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useToast } from '../hooks/useToast';

// const StoreCreate = () => {
//   const [store, setStore] = useState({
//     StoreName: '',
//     Address: '',
//     City: '',
//     ZipCode: '',
//     Phone: '',
//     isVisible: true,
//   });
//   const navigate = useNavigate();
//   const { errorToast, successToast } = useToast();

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setStore({ ...store, [name]: value });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:4000/stores/create', store);
//       successToast('Tạo cửa hàng mới thành công.');
//       navigate('/admin/stores/create');
//     } catch (err) {
//       errorToast('Lỗi khi tạo cửa hàng mới.');
//     }
//   };

//   return (
//     <Container style={{ marginTop: '20px', padding: '50px' }}>
//       <h1 style={{ textAlign: 'center', padding: '20px 0' }}>
//         Thêm Cửa Hàng Mới
//       </h1>
//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="formName">
//           <Form.Label style={{ fontWeight: '600' }}>Tên Cửa Hàng</Form.Label>
//           <Form.Control
//             type="text"
//             name="StoreName"
//             value={store.StoreName}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="formAddress">
//           <Form.Label style={{ fontWeight: '600', marginTop: '15px' }}>
//             Địa chỉ cửa hàng
//           </Form.Label>
//           <Form.Control
//             type="text"
//             name="Address"
//             value={store.Address}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="formCity">
//           <Form.Label style={{ fontWeight: '600', marginTop: '15px' }}>
//             Thành phố
//           </Form.Label>
//           <Form.Control
//             type="text"
//             name="City"
//             value={store.City}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="formZipCode">
//           <Form.Label style={{ fontWeight: '600', marginTop: '15px' }}>
//             Mã Zip
//           </Form.Label>
//           <Form.Control
//             type="text"
//             name="ZipCode"
//             value={store.ZipCode}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="formPhone">
//           <Form.Label style={{ fontWeight: '600', marginTop: '15px' }}>
//             Số điện thoại
//           </Form.Label>
//           <Form.Control
//             type="text"
//             name="Phone"
//             value={store.Phone}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="formEmail">
//           <Form.Label style={{ fontWeight: '600', marginTop: '15px' }}>
//             Email
//           </Form.Label>
//           <Form.Control
//             type="text"
//             name="Email"
//             value={store.Email}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="formVisible">
//           <Form.Check
//             type="checkbox"
//             label="Hiển thị cửa hàng"
//             name="isVisible"
//             checked={store.isVisible}
//             disabled={true}
//             // onChange={e => setStore({ ...store, isVisible: e.target.checked })}
//           />
//         </Form.Group>
//         <Button
//           className="danger-button mb-[20px]"
//           variant="primary"
//           type="submit"
//           style={{ marginTop: '20px', background: '#73262C' }}
//         >
//           Thêm Cửa Hàng
//         </Button>
//       </Form>
//     </Container>
//   );
// };

// export default StoreCreate;
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

const StoreCreate = () => {
  const [store, setStore] = useState({
    StoreName: '',
    Address: '',
    City: '',
    ZipCode: '',
    Phone: '',
    isVisible: true,
  });
  const navigate = useNavigate();
  const { errorToast, successToast } = useToast();
  const [validated, setValidated] = useState(false);
  const handleChange = e => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  const handleSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity()) {
      event.preventDefault();
      try {
        axios.post('http://localhost:4000/stores/create', store)
          .then(() => {
            successToast('Tạo cửa hàng mới thành công.');
            navigate('/admin/stores/create');
          })
          .catch(() => {
            errorToast('Lỗi khi tạo cửa hàng mới.');
          });
      } catch (err) {
        console.error(err);
        errorToast('Lỗi khi tạo cửa hàng mới.');
      }
    }
  };

  return (
    <Container style={{ marginTop: '20px', padding: '50px' }}>
      <h1 className="text-center my-4">Thêm Cửa Hàng Mới</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="validationCustom01" >
          <Form.Label>Tên Cửa Hàng</Form.Label>
          <Form.Control
            type="text"
            name="StoreName"
            value={store.StoreName}
            onChange={handleChange}
            required
            defaultValue="Mark"
          />
                      <Form.Control.Feedback type='invalid'>Chưa nhập mật khẩu.</Form.Control.Feedback>

        </Form.Group>
        <Form.Group controlId="formAddress">
          <Form.Label>Địa chỉ cửa hàng</Form.Label>
          <Form.Control
            type="text"
            name="Address"
            value={store.Address}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type='invalid'>Chưa nhập địa chỉ.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formCity">
          <Form.Label>Thành phố</Form.Label>
          <Form.Control
            type="text"
            name="City"
            value={store.City}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type='invalid'>Chưa nhập thành phố.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formZipCode">
          <Form.Label>Mã Zip</Form.Label>
          <Form.Control
            type="text"
            name="ZipCode"value={store.ZipCode}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type='invalid'>Chưa nhập mã Zip.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formPhone">
          <Form.Label>Số điện thoại</Form.Label>
          <Form.Control
            type="text"
            name="Phone"
            value={store.Phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
          isInvalid={validated && (store.Phone.length !== 10 || !/^\d{10}$/.test(store.Phone))}
          />
          <Form.Control.Feedback type='invalid'>Vui lòng không nhập chữ và đủ 10 số.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            name="Email"
            value={store.Email}
            onChange={handleChange}
            required
            // pattern={/^\S+@\S+\.\S+$/}
            isInvalid={validated && !/^\S+@\S+\.\S+$/.test(store.Email)}

          />
          <Form.Control.Feedback type='invalid'>Vui lòng nhập đúng định dạng email.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formVisible">
          <Form.Check
            type="checkbox"
            label="Hiển thị cửa hàng"
            name="isVisible"
            checked={store.isVisible}
            disabled={true}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3" style={{ backgroundColor: '#73262C' }}>
          Thêm Cửa Hàng
        </Button>
      </Form>
    </Container>
  );
};

export default StoreCreate;