import Head from 'next/head'
import axios from 'axios';
import * as React from 'react';

import CityData from '../../json/city.json';
import { getAuthorizationHeader } from '../../utils/key'
import cx from 'classnames';

import { faLocationArrow, faThermometerQuarter, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useScrollPosition } from 'react-use-scroll-position';

import {
    Card, CardActions, CardContent, CardMedia, Button, Container, Tabs, Tab, Box,
    Typography, Menu, MenuItem, IconButton, TextField, Input, InputLabel, FormControl, Select, List, ListItem, ListItemIcon, ListItemText,
    Drawer, Fade, Modal, Backdrop
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu';
import EjectIcon from '@mui/icons-material/Eject';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


export default function Index() {

    const { data } = CityData;
    const navArr = [
        '主頁',
        '餐飲',
        '旅宿',
        '觀光'
    ];

    const [tourData, setTourData] = React.useState([]);
    const [searchCity, setSeachCity] = React.useState<string>('Taipei City');
    const [tab, setTab] = React.useState(navArr[0]);
    const [keyWord, setKeyword] = React.useState<string>('');
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [showNav, setShowNav] = React.useState<boolean>(false);

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const [popData, setPopData] = React.useState(null);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    // const open = Boolean(anchorEl);

    const anchor = 'right';

    const { y: yPosition } = useScrollPosition();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // first time
    React.useEffect(() => {
        searchTouristPlace('Taipei', '');
    }, [])

    React.useEffect(() => {
        searchTouristPlace(searchCity, keyWord);
    }, [searchCity])

    React.useEffect(() => {
        yPosition !== 0 ? setShowNav(true) : setShowNav(false);
    }, [yPosition])


    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
        console.log('state', state);
    };

    const list = (anchor) => {
        return (
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(anchor, false)}
                onKeyDown={toggleDrawer(anchor, false)}
            >
                <List>
                    {navArr.map((text, index) => (
                        <ListItem button key={text} onClick={() => console.log('text', text)}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Box>)
    };


    const handleTabChange = (event, newValue) => {
        console.log('newValue', newValue);
        setTab(newValue)
    }

    const handleCityChange = (event) => {
        setSeachCity(event.target.value);
    };

    const openLightBox = (clickedData) => {
        console.log('clickedData', clickedData)
        setPopData(clickedData);
        setOpen(true);
    }


    const slideUp = () => {
        console.log('up!');
    }

    const sortEngZhCities = (arrObjData) => {
        const o = {};
        arrObjData.forEach((cityEle) => {
            o[cityEle.CityEngName] = cityEle.CityName;
        })
        return o;
    }

    const engZhCTObj = sortEngZhCities(data);

    const handleKeyword = (e) => {
        setKeyword(e.target.value);
    }


    const filterApiKey = (originCity: String) => {
        return originCity.includes('City') ? originCity.split(' ')[0] : originCity.replace(/\s/g, '');
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
        <div className='pg_tourism'>
            <Box className={cx({ showNav: showNav })}>
                <div className="logoWrap">
                    <img src="/svg/taiwan-icon-white.svg" alt="taiwan-icon" />
                    <div className="travelTxt">
                        <div>
                            Taiwan
                        </div>
                        <div>
                            Travel
                        </div>
                    </div>
                </div>
                <Tabs
                    onChange={handleTabChange}
                    value={tab}
                    aria-label="Tabs where each tab needs to be selected manually"
                >
                    {
                        navArr.map((ele, idx) => {
                            return (
                                <Tab key={ele} label={ele} value={ele} />
                            )
                        })
                    }
                </Tabs>

                <IconButton
                    className="moreIcon"
                    aria-label="more"
                    id="long-button"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={toggleDrawer(anchor, true)}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                >
                    {list(anchor)}
                </Drawer>
            </Box>

            <div className="mainContent">

                <div className="titleContainer">
                    <h1>台灣旅遊景點導覽</h1>
                    <div className="searchItemWrap">


                        <div className="searchItem">
                            <FormControl fullWidth>
                                {/* <InputLabel id="demo-simple-select-label">縣市</InputLabel> */}
                                <Select
                                    className="dropDownInput"
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={searchCity}
                                    label="縣市"
                                    onChange={handleCityChange}
                                >
                                    {CityData.data.map((cityObj) => {
                                        return (
                                            <MenuItem
                                                key={cityObj.CityEngName}
                                                value={cityObj.CityEngName}
                                            // onClick={selectedCity => setSeachCity(selectedCity['key'])}
                                            >
                                                {cityObj.CityName}
                                            </MenuItem>
                                        )
                                    })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <div className="searchItem">
                            <TextField
                                className="searchInput"
                                id="outlined-basic" label="搜尋關鍵字" variant="outlined" onChange={(e: Object) => handleKeyword(e)} />
                        </div>
                        <div className="searchItem">
                            <Button variant="outlined" onClick={() => searchTouristPlace(searchCity, keyWord)}>搜索</Button>
                        </div>
                    </div>
                </div>

                <EjectIcon className="triangleIcon" onClick={() => { () => slideUp() }} />
            </div>

            <Container>
                {/* <SmallTitle /> */}
                <section className="weatherSect">
                    <Typography variant="h6">
                        <FontAwesomeIcon icon={faThermometerQuarter} /> 目前天氣
                    </Typography>
                </section>


                <section className="recommendPlace">
                    <Typography variant="h6">
                        <FontAwesomeIcon icon={faLocationArrow} /> 附近景點
                    </Typography>
                </section>


                <Typography variant="h6" className="searchResult">
                    <FontAwesomeIcon icon={faSearch} /> 搜尋結果
                </Typography>
                <section className="tourSectWrap">
                    {
                        tourData.map((ele, idx) => {
                            return (
                                <Card key={ele.ID} sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        height="240"
                                        image={ele.Picture['PictureUrl1'] || '/img/defaultPlace.png'}
                                        alt="green iguana"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {ele.Name}
                                        </Typography>
                                        <Typography className="siteDesp" variant="body2" color="text.secondary">
                                            {ele.DescriptionDetail}
                                        </Typography>
                                    </CardContent>
                                    <CardActions className="knowMoreWrap">
                                        <Button size="small" onClick={() => openLightBox(ele)}>了解更多<ArrowRightIcon /></Button>
                                    </CardActions>
                                </Card>
                            )
                        })
                    }
                </section>
                {popData &&

                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={open}>
                            <Box sx={style}>
                                <Card key={popData.ID} sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        height="240"
                                        image={popData.Picture['PictureUrl1'] || '/img/defaultPlace.png'}
                                        alt="green iguana"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {popData.Name}
                                        </Typography>
                                        <Typography className="siteDesp" variant="body2" color="text.secondary">
                                            {popData.DescriptionDetail}
                                        </Typography>
                                    </CardContent>
                                    <CardActions className="knowMoreWrap">
                                        <Button size="small" href={popData.WebsiteUrl} target="blank">官方連結<ArrowRightIcon /></Button>
                                    </CardActions>
                                </Card>
                            </Box>
                        </Fade>
                    </Modal>

                }
            </Container>


            {/* <Footer style={{ textAlign: 'center' }}>Designed by Violet Developed by Jinwei ©2021 </Footer> */}
        </div>
    )
}
