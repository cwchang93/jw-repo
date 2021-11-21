import axios from "axios";
import * as React from "react";

import CityData from "../../json/city.json";
import { getAuthorizationHeader } from "../../utils/key";
import cx from "classnames";

import {
  faLocationArrow,
  faSearch,
  faChevronCircleUp,
  faChevronCircleDown,
  faMapMarkerAlt,
  faTimes,
  faStreetView,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useScrollPosition } from "react-use-scroll-position";

import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Container,
  Tabs,
  Tab,
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  TextField,
  Input,
  InputLabel,
  FormControl,
  Select,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Fade,
  Modal,
  Backdrop,
  ClickAwayListener,
  Popper,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import EjectIcon from "@mui/icons-material/Eject";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import GoogleMapReact from "google-map-react";
// import { Key } from '../../key.js';

export default function Index() {
  // KEYS
  const MAP_KEY = process.env.NEXT_PUBLIC_MAPKEY;
  const PTX_ID = process.env.NEXT_PUBLIC_PTXID;
  const PTX_KEY = process.env.NEXT_PUBLIC_PTXKEY;

  // Data
  const { data } = CityData;

  const navArr = ["主頁", "餐飲", "旅宿", "觀光"];

  const AnyReactComponent = ({ text }) => (
    <div className="curPositionWrap">
      <FontAwesomeIcon className="mapTag" icon={faStreetView} /> {text}{" "}
    </div>
  );

  const BikeComponent = (dataObj) => {
    return (
      <div className="bikeWrap">
        <FontAwesomeIcon className="bikeTag" icon={faMapMarkerAlt} />
      </div>
    );
  };

  const [bikeData, setBikeData] = React.useState([]);
  const [searchCity, setSeachCity] = React.useState<string>("Taipei City");
  const [tab, setTab] = React.useState(navArr[0]);
  const [keyWord, setKeyword] = React.useState<string>("");

  const [showNav, setShowNav] = React.useState<boolean>(false);

  const [showDetail, setShowDetail] = React.useState<boolean>(false);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [popData, setPopData] = React.useState(null);

  const [curPosition, setCurPosition] = React.useState([
    25.0715015,
    121.6628513,
  ]);

  const anchor = "right";

  const { y: yPosition } = useScrollPosition();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // first time
  React.useEffect(() => {
    searchTouristPlace("Taipei", "");
    getCurPosition();
  }, []);

  React.useEffect(() => {
    searchTouristPlace(searchCity, keyWord);
    setCurPosition(curPosition);
  }, [searchCity, curPosition]);

  React.useEffect(() => {
    yPosition !== 0 ? setShowNav(true) : setShowNav(false);
  }, [yPosition]);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
    console.log("state", state);
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
            <ListItem
              button
              key={text}
              onClick={() => console.log("text", text)}
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  const handleTabChange = (event, newValue) => {
    console.log("newValue", newValue);
    setTab(newValue);
  };

  const handleCityChange = (event) => {
    setSeachCity(event.target.value);
  };

  const openLightBox = (clickedData) => {
    console.log("clickedData", clickedData);
    setPopData(clickedData);
    setOpen(true);
  };

  const getCurPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          //   console.log(position);
          const { latitude } = position.coords;
          const { longitude } = position.coords;

          const coords = [latitude, longitude];
          setCurPosition(coords);
        },
        () => {
          alert("無法找到你現在位置，請刷先頁面，再試一次");
        }
      );
    }
  };

  const slideUp = () => {
    console.log("up!");
  };

  const sortEngZhCities = (arrObjData) => {
    const o = {};
    arrObjData.forEach((cityEle) => {
      o[cityEle.CityEngName] = cityEle.CityName;
    });
    return o;
  };

  const engZhCTObj = sortEngZhCities(data);

  const handleKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const filterApiKey = (originCity: String) => {
    return originCity.includes("City")
      ? originCity.split(" ")[0]
      : originCity.replace(/\s/g, "");
  };

  const searchTouristPlace = (
    city: string,
    keywordTxt: string,
    dataNums: number = 40
  ) => {
    const fectchedApi = `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/NearBy?$top=30&$spatialFilter=nearby(${positionObj["lat"]}, ${positionObj["lng"]}, 1000)&$format=JSON`;

    https: axios
      .get(fectchedApi, {
        headers: getAuthorizationHeader(PTX_ID, PTX_KEY),
      })
      .then((res) => {
        console.log("res", res);
        setBikeData(res.data);
      });
  };

  const positionObj = {
    lat: curPosition[0],
    lng: curPosition[1],
  };

  const curPositionObj = {
    lat: popData?.Position?.PositionLat,
    lng: popData?.Position?.PositionLon,
  };

  return (
    <div className="pg_bike">
      <Box className={cx({ showNav: showNav })}>
        <div className="logoWrap">
          <img src="/svg/taiwan-icon-white.svg" alt="taiwan-icon" />
          <div className="travelTxt">
            <div>Taiwan</div>
            <div>Travel</div>
          </div>
        </div>
        <Tabs
          onChange={handleTabChange}
          value={tab}
          aria-label="Tabs where each tab needs to be selected manually"
        >
          {navArr.map((ele, idx) => {
            return <Tab key={ele} label={ele} value={ele} />;
          })}
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
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="searchItem">
              <TextField
                className="searchInput"
                id="outlined-basic"
                label="搜尋關鍵字"
                variant="outlined"
                onChange={(e: Object) => handleKeyword(e)}
              />
            </div>
            <div className="searchItem">
              <Button
                variant="outlined"
                onClick={() => searchTouristPlace(searchCity, keyWord)}
              >
                搜索
              </Button>
            </div>
          </div>
        </div>

        <EjectIcon
          className="triangleIcon"
          onClick={() => {
            () => slideUp();
          }}
        />
      </div>

      <Container>
        <section className="recommendPlace">
          <Typography variant="h6">
            <FontAwesomeIcon icon={faLocationArrow} /> 目前位置＆附近單車
          </Typography>
          <div style={{ height: "80vh", width: "100%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: MAP_KEY }}
              center={{
                lat: curPosition[0],
                lng: curPosition[1],
              }}
              zoom={16}
            >
              <AnyReactComponent {...positionObj} text="" />

              {bikeData.map((eachStation, idx) => {
                const positionObj = {
                  lat: eachStation["StationPosition"]["PositionLat"],
                  lng: eachStation["StationPosition"]["PositionLon"],
                };
                return (
                  <BikeComponent
                    key={eachStation["StationID"]}
                    dataObj={eachStation}
                    // text={eachStation["StationName"]["Zh_tw"].split("_")[1]}
                    {...positionObj}
                  />
                );
              })}
            </GoogleMapReact>
          </div>
        </section>
      </Container>

      {/* <Footer style={{ textAlign: 'center' }}>Designed by Violet Developed by Jinwei ©2021 </Footer> */}
    </div>
  );
}
