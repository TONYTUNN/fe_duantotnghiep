// import React from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import '../style/footer.css'
// const Footer = () => {
//   return (
//     <footer className="bg-light text-center text-lg-start">
//       <Container className="p-4">
//         <Row>
//           <Col lg={6} md={12} className="mb-4 mb-md-0">
//             <h5 className="text-uppercase">Ice Cream Shop</h5>
//             <p>
//               Enjoy the best ice cream in town! Made with the freshest ingredients and love.
//             </p>
//           </Col>
//           <Col lg={3} md={6} className="mb-4 mb-md-0">
//             <h5 className="text-uppercase">Links</h5>
//             <ul className="list-unstyled mb-0">
//               <li><a href="/" className="text-dark">Home</a></li>
//               <li><a href="/products" className="text-dark">Products</a></li>
//               <li><a href="/cart" className="text-dark">Cart</a></li>
//               <li><a href="/contact" className="text-dark">Contact</a></li>
//             </ul>
//           </Col>
//           <Col lg={3} md={6} className="mb-4 mb-md-0">
//             <h5 className="text-uppercase">Contact</h5>
//             <ul className="list-unstyled mb-0">
//               <li><span className="text-dark">Email: info@icecreamshop.com</span></li>
//               <li><span className="text-dark">Phone: +123 456 789</span></li>
//               <li><span className="text-dark">Address: 123 Ice Cream St.</span></li>
//             </ul>
//           </Col>
//         </Row>
//       </Container>
//       <div className="text-center p-3 bg-dark text-white">
//         &copy; 2024 Ice Cream Shop. All Rights Reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;
// ---------------------------------------------------------------------------------------------
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../style/footer.css'

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#2A2A2A', color: '#fff' }} className="text-center text-lg-start">
      <Container className="p-4">
        <Row>
          <Col lg={6} md={12} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Ice Cream Shop</h5>
            <p style={{color:'#fff'}}>
              Enjoy the best ice cream in town! Made with the freshest ingredients and love.
            </p>
          </Col>
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Links</h5>
            <ul className="list-unstyled mb-0">
              <li><a href="/" style={{ color: '#fff' }}>Home</a></li>
              <li><a href="/products" style={{ color: '#fff' }}>Products</a></li>
              <li><a href="/cart" style={{ color: '#fff' }}>Cart</a></li>
              <li><a href="/contact" style={{ color: '#fff' }}>Contact</a></li>
            </ul>
          </Col>
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Contact</h5>
            <ul className="list-unstyled mb-0">
              <li><span style={{ color: '#fff' }}>Email: info@icecreamshop.com</span></li>
              <li><span style={{ color: '#fff' }}>Phone: +123 456 789</span></li>
              <li><span style={{ color: '#fff' }}>Address: 123 Ice Cream St.</span></li>
            </ul>
          </Col>
        </Row>
      </Container>
      <div className="text-center p-3" style={{ backgroundColor: '#2A2A2A', color: '#fff' }}>
        &copy; 2024 Ice Cream Shop. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
