import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
    <Menu.Item key="mail">
      <a href="/">Home</a>
    </Menu.Item>
    <SubMenu title={<span>Blogs</span>}>
      <MenuItemGroup title="Who Am I">
        <Menu.Item key="setting:1"><a href="https://github.com/YoonHae">GitHub</a></Menu.Item>
      </MenuItemGroup>
      <MenuItemGroup title="Where Is This Project?">
        <Menu.Item key="setting:3"><a href="https://github.com/YoonHae/RUN-TRIP">Back</a></Menu.Item>
        <Menu.Item key="setting:4"><a href="https://github.com/YoonHae/RUN-TRIP-REACT">Front</a></Menu.Item>
      </MenuItemGroup>
      <MenuItemGroup title="What is RUN-TRIP">
        <Menu.Item key="setting:5"><a href="https://github.com/YoonHae/RUN-TRIP/wiki">Introduce</a></Menu.Item>
      </MenuItemGroup>
    </SubMenu>
  </Menu>
  )
}

export default LeftMenu