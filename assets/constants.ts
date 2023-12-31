export const Constants = {
    // CANVAS
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    CANVAS_EDGE_BUFFER: 50,
    // STATIONS
    STATION_SIZE: 40,
    STATION_OUTLINE: 10,
    NUM_STATIONS: 7,
    STATION_PROXY_THRESHOLD: 80,
    STATION_CAPACITY: 8,
    STATION_ROW_CAP: 4,
    // MENU STUFF
    LINE_MENU_PCT_X: 0.1,
    LINE_MENU_PCT_BUFFER: 0.02,
    LINE_MENU_SIZE: 70,
    LINE_MENU_INACTIVE_MULTIPLIER: 0.4,
    LOCKED_COLOR: 'gray',
    // LINES
    NUM_STARTING_LINES: 3,
    EDGE_WIDTH: 15,
    // LINE ENDS
    LINE_END_BASE_LENGTH: 45,
    // PEOPLE
    PERSON_SIZE: 12.5,
    PERSON_XOFFSET: 5,
    PERSON_YOFFSET: 5,
    PERSON_OFFSET: 5, // TODO REMOVE X and Y OFFSET, just use this
    SPAWN_RATE: 200, // frames
    // TRAINS
    TRAIN_LENGTH: 50,
    TRAIN_ASPECT: 0.6,
    PASSENGER_SIZE_MULTIPLIER: 0.7,
    PASSENGER_LIGHTNESS_FACTOR: 0.7,
    TRAIN_SPEED:2, // pixels per frame
    STATION_PAUSE_LENGTH: 50, // frames
    TURN_SMOOTHING_THRESHOLD: 10 // pixels
};