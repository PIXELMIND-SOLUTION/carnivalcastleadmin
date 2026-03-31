import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer" style={{backgroundColor:"#272822"}}>
        <Container fluid={true}>
          <Row>
            <Col md={6}>{new Date().getFullYear()} © Carnival Castle Admin .</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                Design & Develop by <a
                  href="https://pixelmindsolutions.com/"
                  target="_blank"
                  rel="noreferrer"
                  style={{color:"white"}}
                >
                  PIXELMINDSOLUTIONS
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
