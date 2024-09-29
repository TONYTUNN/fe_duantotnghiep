import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import '../style/contact.css'; // Thêm CSS nếu cần
const Contact = () => {
  return (
    <Container>
      <h1>Liên hệ với chúng tôi</h1>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email </Form.Label>
          <Form.Control type="email" placeholder="email" />
        </Form.Group>

        <Form.Group controlId="formBasicMessage">
          <Form.Label>Tin nhắn</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Tin nhắn" />
        </Form.Group>
      <br/>
        <Button variant="" className='btn-submit-contact' type="submit" style={{ background:'rgb(115,38,44)', color:'white' }}>
          Gửi
        </Button>
      </Form>

      <h2 style={{padding:"10px 0",textAlign:"center"}}>Vị trí</h2>
      <div className="map-container" style={{ marginTop: '20px' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d251637.95196238213!2d105.6189045!3d9.779349!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1722192905664!5m2!1svi!2s"
          width="100%"
          height="500"
          style={{ border: '0' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps"
        />
      </div>
    </Container>
  );
};

export default Contact;
// -----------------------------------------------------
// import React from 'react';
// import { Container, Form, Button } from 'react-bootstrap';
// import '../style/contact.css'; // Thêm CSS nếu cần
// const Contact = () => {
//   return (
//     <Container>
//         <div className='contact_text'>
//         <h1>Liên Hệ Với Chúng Tôi</h1>
//         <img
//             src={`${process.env.PUBLIC_URL}/images/image 37.png`}
//             alt="First slide"
//           />
//         <h4>Chúng tôi luôn luôn lắng nghe những góp ý chân thành của Quý Khách để chất lượng phục vụ ngày 
//           càng tốt hơn. Chúng tôi rất mong nhận được sự phản hồi từ Quý Vị theo thông tin liên lạc như 
//           trên. Hoặc Quý Vị vui lòng gửi biểu mẫu dưới đây, chúng tôi sẽ phản hồi sớm nhất có thể.
//           </h4>
//       </div>
//       <Form>
//         <Form.Group controlId="formBasicEmail">
//           <Form.Label>Địa chỉ email</Form.Label>
//           <Form.Control type="email" placeholder="Nhập email" />
//         </Form.Group>

//         <Form.Group controlId="formBasicMessage">
//           <Form.Label>Tin nhắn</Form.Label>
//           <Form.Control as="textarea" rows={3} placeholder="Nội dung bạn muốn nói" />
//         </Form.Group>
//       <br/>
//         <Button variant="" type="submit" style={{ background:'rgb(115,38,44)', color:'white' }}>
//           Submit
//         </Button>
//       </Form>

//       <h2>Our Location</h2>
//       <div className="map-container" style={{ marginTop: '20px' }}>
//         <iframe
//           src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d251637.95196238213!2d105.6189045!3d9.779349!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1722192905664!5m2!1svi!2s"
//           width="100%"
//           height="500"
//           style={{ border: '0' }}
//           allowFullScreen=""
//           loading="lazy"
//           referrerPolicy="no-referrer-when-downgrade"
//           title="Google Maps"
//         />
//       </div>
//     </Container>
//   );
// };

// export default Contact;