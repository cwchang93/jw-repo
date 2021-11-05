import Head from 'next/head'
import axios from 'axios';
import * as React from 'react';

import { Layout, Menu, Breadcrumb, Dropdown, Input, Col, Row } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import CityData from '../../json/city.json';
import { getAuthorizationHeader } from '../../utils/key'

import { faLocationArrow, faMapMarkerAlt, faPhoneVolume } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Index() {

    const [tourData, setTourData] = React.useState([]);
    const { Header, Content, Footer } = Layout;

    const navArr = ['觀光景點', '美食住宿', '交通動態']

    const [searchCity, setSeachCity] = React.useState<string>('Taipei City')

    // const { Meta } = Card;

    // const { Text, Link } = Typography;


    React.useEffect(() => {
        searchTouristPlace('Taipei', '');

    }, [])

    const onSearch = (value: string) => {
        searchTouristPlace(searchCity, value);

        console.log('val', value);
    }

    const filterApiKey = (originCity: String) => {
        return originCity.includes('City') ? originCity.split(' ')[0] : originCity.replace(/\s/g, '');
    }





    const menu = () => {
        const { data } = CityData;

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

    const searchTouristPlace = (city: string, keywordTxt: string, dataNums: number = 40) => {

        const fectchedApi = keywordTxt ? `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${filterApiKey(city)}?$filter=contains(Name,'${keywordTxt}')&$top=${dataNums}&$format=JSON` : `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${filterApiKey(city)}?$top=${dataNums}&$format=JSON`

        axios.get(fectchedApi, {
            headers: getAuthorizationHeader()
        }).then((res) => {
            console.log(res.data);
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
            <Content >
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

                <FontAwesomeIcon icon={faLocationArrow} /> 景點
                <section className="tourSectWrap">
                    {
                        tourData.map((ele, idx) => {
                            return (
                                <Card key={ele.ID} sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={ele.Picture['PictureUrl1']}
                                        alt="green iguana"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {ele.Name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {ele.DescriptionDetail}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" target="blank" href={ele.WebsiteUrl}>了解詳情</Button>
                                    </CardActions>
                                </Card>
                                // <Col span={6}>
                                //     <Card
                                //         key={idx}
                                //         hoverable
                                //         style={{ width: 240 }}
                                //         cover={<img alt="example" src={ele.Picture['PictureUrl1']} />}
                                //     >
                                //         <Meta title={ele.Name} />

                                //         {
                                //             ele.Address &&
                                //             <Card.Grid className="address" >
                                //                 <FontAwesomeIcon icon={faMapMarkerAlt} />
                                //                 {ele.Address}
                                //             </Card.Grid>
                                //         }                                    

                                //         <div className="contactInfo">
                                //             <FontAwesomeIcon icon={faPhoneVolume} />
                                //             {ele.Phone}
                                //         </div>
                                //         <Meta description={ele.DescriptionDetail} />
                                //     </Card>
                                // </Col>
                            )
                        })
                    }
                </section>

            </Content>
            <Footer style={{ textAlign: 'center' }}>Designed by Violet Developed by Jinwei ©2021 </Footer>
        </Layout>
    )
}
