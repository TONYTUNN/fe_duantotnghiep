// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Row, Col } from 'react-bootstrap';
// import ProductCard from './ProductCard';
// import { useLocation } from 'react-router-dom'; // Để lấy query parameters từ URL
// import '../style/home.css'; // Đảm bảo đường dẫn đến file CSS đúng

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const location = useLocation(); // Lấy query parameters từ URL

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const query = new URLSearchParams(location.search).get('category');
//         const response = await axios.get(
//           `http://localhost:4000/products${query ? `?category=${query}` : ''}`,
//         );
//         let fetchedProducts = response.data;

//         // Giả sử sản phẩm có trường `rating` để xác định "ngon nhất"
//         const topProducts = fetchedProducts
//           .sort((a, b) => b.rating - a.rating) // Sắp xếp sản phẩm theo `rating` từ cao xuống thấp
//           .slice(0, 3); // Lấy ra 5 sản phẩm đầu tiên

//         setProducts(topProducts);
//         setLoading(false);
//       } catch (error) {
//         setError('Không thể lấy sản phẩm.');
//         setLoading(false);
//         console.error('Error fetching products:', error);
//       }
//     };

//     fetchProducts();
//   }, [location.search]); // Gọi lại khi query parameters thay đổi

//   if (loading) {
//     return <p>Đang tải sản phẩm...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <Row>
//       {products.length > 0 ? (
//         products.map(product => (
//           <Col
//             key={product.ProductID}
//             sm={12}
//             md={6}
//             lg={4}
//             xl={3}
//             className="col-product"
//           >
//             <ProductCard product={product} className="product-card" />
//           </Col>
//         ))
//       ) : (
//         <p>Không có sản phẩm nào.</p>
//       )}
//     </Row>
//   );
// };

// export default ProductList;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Row, Col } from 'react-bootstrap';
// import ProductCard from './ProductCard';
// import { useLocation } from 'react-router-dom'; // Để lấy query parameters từ URL
// import '../style/home.css'; // Đảm bảo đường dẫn đến file CSS đúng

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const location = useLocation(); // Lấy query parameters từ URL

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const query = new URLSearchParams(location.search).get('category');
//         const response = await axios.get(
//           `http://localhost:4000/latest-sales${query ? `?category=${query}` : ''}`,
//         );
//         let fetchedProducts = response.data;

//         // Giả sử sản phẩm có trường `rating` để xác định "ngon nhất"
//         const topProducts = fetchedProducts
//           .sort((a, b) => b.rating - a.rating) // Sắp xếp sản phẩm theo `rating` từ cao xuống thấp
//           .slice(0, 3); // Lấy ra 5 sản phẩm đầu tiên

//         setProducts(topProducts);
//         setLoading(false);
//       } catch (error) {
//         setError('Không thể lấy sản phẩm.');
//         setLoading(false);
//         console.error('Error fetching products:', error);
//       }
//     };

//     fetchProducts();
//   }, [location.search]); // Gọi lại khi query parameters thay đổi

//   if (loading) {
//     return <p>Đang tải sản phẩm...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <Row>
//       {products.length > 0 ? (
//         products.slice(0,4).map(product => (
//           <Col
//             key={product.ProductID}
//             sm={12}
//             md={6}
//             lg={4}
//             xl={3}
//             className="col-product"
//           >
//             <ProductCard product={product} className="product-card" />
//           </Col>
//         ))
//       ) : (
//         <p>Không có sản phẩm nào.</p>
//       )}
//     </Row>
//   );
// };

// export default ProductList;
// -----------------------------------
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { useLocation } from 'react-router-dom'; // Để lấy query parameters từ URL
import '../style/home.css'; // Đảm bảo đường dẫn đến file CSS đúng

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); // Lấy query parameters từ URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = new URLSearchParams(location.search).get('category');
        const response = await axios.get(
          `http://localhost:4000/latest-sales${query ? `?category=${query}` : ''}`
        );
        let fetchedProducts = response.data;

        // Giả sử sản phẩm có trường `rating` để xác định "ngon nhất"
        const topProducts = fetchedProducts
          .sort((a, b) => b.rating - a.rating) // Sắp xếp sản phẩm theo `rating` từ cao xuống thấp
          .slice(0, 4); // Lấy ra 4 sản phẩm đầu tiên

        setProducts(topProducts);
        setLoading(false);
      } catch (error) {
        setError('Không thể lấy sản phẩm.');
        setLoading(false);
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [location.search]); // Gọi lại khi query parameters thay đổi

  if (loading) {
    return <p>Đang tải sản phẩm...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Row>
      {products.length > 0 ? (
        products.map(product => (
          <Col
            key={product.ProductID}
            sm={12}
            md={6}
            lg={4}
            xl={3}
            className="col-product"
          >
            <ProductCard product={product} className="product-card" />
          </Col>
        ))
      ) : (
        <p>Không có sản phẩm nào.</p>
      )}
    </Row>
  );
};

export default ProductList;
