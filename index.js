const BrightcovePlayer = require('./src/BrightcovePlayer');
const BrightcovePlayerPoster = require('./src/BrightcovePlayerPoster');
const BrightcovePlayerUtil = require('./src/BrightcovePlayerUtil');
const BCPlayer = require('./src/BCPlayer');
const ScrollView = require('./src/ScrollView');
const PlayerEventTypes = require('./src/PlayerEventTypes');
const ControlBar = require('./src/ControlBar');
const ToggleIcon = require('./src/ToggleIcon');
const Scrubber = require('./src/Scrubber');
const Time = require('./src/Time');

module.exports = {
    Time: Time,
    Scrubber: Scrubber,
    ToggleIcon: ToggleIcon,
    ControlBar: ControlBar,
    BCPlayer: BCPlayer,
    BrightcovePlayer: BrightcovePlayer,
    BrightcovePlayerPoster: BrightcovePlayerPoster,
    BrightcovePlayerUtil: BrightcovePlayerUtil,
    ScrollView: ScrollView,
    PlayerEventTypes: PlayerEventTypes
};
