import { Button, Container, Menu, Image, Dropdown } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../stores/store";
import userPng from '/assets/user.png'
import { observer } from "mobx-react-lite";

function NavBar() {
  const { userStore: { user, logout } } = useStore();
  return (
    <Menu inverted fixed={"top"}>
      <Container>
        <Menu.Item as={NavLink} to="/" header>
          <img
            src="./assets/logo.png"
            alt={"logo"}
            style={{ marginRight: "10px" }}
          ></img>
          Reactivities
        </Menu.Item>
        <Menu.Item as={NavLink} to="/activities" name="Activities" />
        <Menu.Item as={NavLink} to="/errors" name="Test Errors" />
        <Menu.Item>
          <Button
            as={NavLink}
            to="/createActivity"
            positive
            content="Create Activity"
          />
        </Menu.Item>

        <Menu.Item position="right">
          <Image src={user?.image || userPng} avatar spaced='right' />
          <Dropdown pointing='top left' text={user?.displayName} >
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to={`/profile/${user?.username}`} text='My Profile' icon='user' />
              <Dropdown.Item onClick={logout} text="Logout" icon='power' />
            </Dropdown.Menu>

          </Dropdown>
        </Menu.Item>

      </Container>
    </Menu>
  );
}

export default observer(NavBar);