import Head from 'next/head'
import axios from 'axios';
import * as React from 'react';

import { Layout, Menu, Breadcrumb, Dropdown, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import TwCitySelector from 'tw-city-selector';
import CityData from '../../json/city.json';
import { getAuthorizationHeader } from '../../utils/key'

export default function Index() {

    const [tourData, setTourData] = React.useState([]);
    const { Header, Content, Footer } = Layout;

    const navArr = ['觀光景點', '美食住宿', '交通動態']

    const [searchCity, setSeachCity] = React.useState<string>('選擇縣市')

    const contentStyle = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };

    const onSearch = (value: String) => {
        searchTouristPlace(searchCity);

        console.log('val', value);
    }

    const filterApiKey = (originCity: String) => {
        return originCity.includes('City') ? originCity.split(' ')[0] : originCity.replace(/\s/g, '');
    }

    const arr = [];




    const menu = () => {
        const { data } = CityData;
        const cityArr = data.map((ele) => {
            return filterApiKey(ele.CityEngName);
        })

        const itemDom = data.map((cityObj) => {
            return (
                <Menu.Item key={cityObj.CityEngName} onClick={selectedCity => setSeachCity(selectedCity['key'])}>
                    {cityObj.CityName}
                </Menu.Item>
            )
        })

        return (
            <Menu>
                {itemDom}
            </Menu>
        )
    }

    const searchTouristPlace = (city) => {
        axios.get(`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${filterApiKey(city)}?$top=4&$format=JSON`, {
            headers: getAuthorizationHeader()
        }).then((res) => {
            setTourData(res.data);
        })
    }


    return (
        <Layout className="layout">
            <Header>
                {/* <div className="logo" /> */}
                <img className="logo" src="https://chun-wei.com/img/jinwei_logo4.png" alt="JW's profile" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    {navArr.map((ele, index) => {
                        const key = index + 1;
                        return <Menu.Item key={key}>{ele}</Menu.Item>;
                    })}

                </Menu>


            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    <div className="titleContainer">
                        <h1>台灣旅遊景點導覽</h1>
                        <div className="searchItem">
                            <Dropdown overlay={menu}>
                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                    {searchCity} <DownOutlined />
                                </a>
                            </Dropdown>
                        </div>
                        <div className="searchItem">
                            <Input.Search placeholder="搜尋關鍵字" onSearch={onSearch} enterButton />
                        </div>
                        <div className="searchItem"></div>
                    </div>


                </div>

                <section>
                    {
                        JSON.stringify(tourData)
                    }
                </section>

            </Content>
            <Footer style={{ textAlign: 'center' }}>Designed by Violet Developed by Jinwei ©2021 </Footer>
        </Layout>
    )
}
