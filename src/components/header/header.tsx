import React, {ReactNode} from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import './header.css';

interface Props {
    href: string;
    children: ReactNode;
}

const Header: React.FC = () => {
    return (
        <Navbar expand="lg" className="custom-navbar" sticky="top">
            <Container>
                <Navbar.Brand href="/" className="brand">Coordinator Helper</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto nav-links">
                        <CustomLink href="/todolist">Список дел</CustomLink>
                        <NavDropdown title="Скрипты" id="basic-nav-dropdown" className="nav-item-custom dropdown-custom">
                            <NavDropdown.Item href="confirm" className="dropdown-item-custom">Подтверждение</NavDropdown.Item>
                            <NavDropdown.Item href="confirm" className="dropdown-item-custom">Играли ранее?</NavDropdown.Item>
                            <NavDropdown.Item href="confirm" className="dropdown-item-custom">Наличие экрана?</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="contacts" className="nav-item-custom">Контакты</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

function CustomLink({href, children}: Props) {
    return (
        <Nav.Link href={href} className="nav-item-custom">{children}</Nav.Link>
    )
}

export default Header;
