var fs = require("fs");
var Chance = require('chance');
var chance = new Chance();

//tODO
var TIME_STAMP = "20150415T000515+0100"

//GLOBAL VARIABLES
var _Teams = [];

//Macros' like workaround
var SOCCER_DOC_MAX_VALUE = 999999,
    COMPETITION_MAX_ID_VALUE = 999,
    COMPETITION_COUNTRY = "England",
    COMPETITION_NAME = "PremierLeague",
    COMPETITION_SEASON_ID = "2015",
    COMPETITION_SEASON_NAME = "Season 2015/2016"
    COMPETITION_SEASON_SYMID = "PREM_LG",
    COMPETITION_SEASON_MATCH_DAY_MAX_VALUE = 7;

var ROUND_NAME = "Season",
    ROUND_POOL_MAX_VALUE = 10,
    ROUND_NUMBER_MAX_VALUE = 36;

var MATCH_TYPE = "Regular",
    MATCH_PERIOD = "SecondHalf";

var MATCH_OFFICIAL_TIME_MIN = 45,
    MATCH_OFFICIAL_TIME_MAX = 95,
    MATCH_OFFICIAL_FH_START = "20151504T230039",
    MATCH_OFFICIAL_FH_TIME_MIN_VALUE = 45,
    MATCH_OFFICIAL_FH_TIME_MAX_VALUE = 49,
    MATCH_OFFICIAL_FH_STOP = "20151504T234841",
    MATCH_OFFICIAL_SH_START = "20151604T000515";

var TEAM_GOALS_MAX_VALUE = 5;

var OFFICIAL_ID_MAX_VALUE = 99999,
    OFFICIAL_TYPE = "Main";

var MANAGER_TYPE = 'Manager',
    MANAGER_ID_PREFIX = 'man'
    MANAGER_ID_MAX_VALUE = 99999;

var VENUE_ID_MAX_VALUE = 9999,
    VENUE_COUNTRY = 'Portugal',
    VENUE_NAME = 'Stadium',
    VENUE_NAME_MAX_VALUE = 99;

var MANAGER_ID_PREFIX = 'p',
    PLAYER_ID_MAX_VALUE = 999999;

var TEAM_ID_PREFIX = 't',
    TEAM_ID_MAX_VALUE = 9999,
    TEAM_COUNTRY = 'England',
    TEAM_NAME_PREFIX = 'Team',
    TEAM_NAME_MAX_VALUE = 999;

var FORMATION_TACTICS = ['442','4231','532'],
    FORMATION_TOTAL_PLAYERS = 20;

var player_position = {
        'GK': 'Goalkeeper',
        'DF': 'Defender',
        'MF': 'Midfielder',
        'ST': 'Striker',
        'SB': 'Substitute'
    };

//PLAYER STATS
var _Player_Stats = [],
    _Player_Stats_values = [];

_Player_Stats_values["GK"] = {min:1, max:10};
_Player_Stats_values["DF"] = {min:1, max:10};
_Player_Stats_values["MF"] = {min:1, max:10};
_Player_Stats_values["ST"] = {min:1, max:10};

_Player_Stats[player_position.GK] = [{description:"accurate_keeper_sweeper",values:{min: _Player_Stats_values["GK"].min, max: _Player_Stats_values["GK"].max}},
                        {description:"accurate_pass",values:{min: _Player_Stats_values["GK"].min, max: _Player_Stats_values["GK"].max}},
                        {description:"total_final_third_passes",values:{min: _Player_Stats_values["GK"].min, max: _Player_Stats_values["GK"].max}},
                        {description:"attempts_conceded_ibox",values:{min: _Player_Stats_values["GK"].min, max: _Player_Stats_values["GK"].max}},
                        {description:"touches",values:{min: _Player_Stats_values["GK"].min, max: _Player_Stats_values["GK"].max}},
                        {description:"total_fwd_zone_pass",values:{min: _Player_Stats_values["GK"].min, max: _Player_Stats_values["GK"].max}}
                      ];

_Player_Stats[player_position.DF] = [{description:"duel_lost",values:{min: 1, max: 10}},
                        {description:"accurate_pass",values:{min: 1, max: 10}},
                        {description:"won_tackle",values:{min: 1, max: 10}},
                        {description:"total_final_third_passes",values:{min: 1, max: 10}},
                        {description:"rightside_pass",values:{min: 1, max: 10}},
                        {description:"attempts_conceded_ibox",values:{min: 1, max: 10}},
                      ];

_Player_Stats[player_position.MF] = [{description:"leftside_pass",values:{min: 1, max: 10}},
                        {description:"accurate_pass",values:{min: 1, max: 10}},
                        {description:"won_tackle",values:{min: 1, max: 10}},
                        {description:"total_final_third_passes",values:{min: 1, max: 10}},
                        {description:"rightside_pass",values:{min: 1, max: 10}},
                    ];

_Player_Stats[player_position.ST] = [{description:"total_flick_on",values:{min: 1, max: 10}},
                        {description:"duel_lost",values:{min: 1, max: 10}},
                        {description:"blocked_scoring_att",values:{min: 1, max: 10}},
                        {description:"leftside_pass",values:{min: 1, max: 10}},
                        {description:"poss_won_att_3rd",values:{min: 1, max: 10}},
                        {description:"att_rf_total",values:{min: 1, max: 10}}
                    ];

_Player_Stats[player_position.SB] = [{description:"formation_place",values:{min: 0, max: 0}}];

//.GK = {min: 1, max: 10};

//FUNCTIONS TO CREATE ATOMIC TAGS
function createPersonName()
{
    return {
            First: chance.first(),
            Last: chance.last()
    }
}
function createTeamOfficial()
{
    return {
        TeamOfficial: {
            '-Type': MANAGER_TYPE,
            '-uID': MANAGER_ID_PREFIX + chance.natural({max: MANAGER_ID_MAX_VALUE}),
            PersonName: createPersonName()
        }
    }
}


function createPlayer(position)
{
    return {
            '-Position': position,
            '-uID': MANAGER_ID_PREFIX + chance.natural({max: PLAYER_ID_MAX_VALUE}),
            PersonName: createPersonName()
    }
}

function createTeam()
{
    var team_players = [],
        formation_tactics_index = chance.natural({max:FORMATION_TACTICS.length - 1}),
        team_tactic = FORMATION_TACTICS[formation_tactics_index], //JAP toDO: should look to the team tactics tag
        team_nr_defenders = team_tactic[0],
        team_nr_strikers = team_tactic[team_tactic.length - 1],
        team_nr_midfielders = 10 - team_nr_defenders - team_nr_strikers;

    console.log('team tactic:   ' + team_tactic);
    console.log('team nr defenders:   ' + team_nr_defenders);
    console.log('team nr midfielders:   ' + team_nr_midfielders);
    console.log('team nr strikers:   ' + team_nr_strikers);

    createPlayerPosition('GK', 1, team_players);
    createPlayerPosition('DF', team_nr_defenders, team_players);
    createPlayerPosition('MF', team_nr_midfielders, team_players);
    createPlayerPosition('ST', team_nr_strikers, team_players);
    createPlayerPosition('SB', FORMATION_TOTAL_PLAYERS - 11, team_players)

    //console.log("team_players:  ");
    //console.log(JSON.stringify(team_players));

    _Teams.push(team_players);

    return {
        Team: {
            '-uID': TEAM_ID_PREFIX + chance.natural({max: TEAM_ID_MAX_VALUE}),
            Country: TEAM_COUNTRY,
            Name: TEAM_NAME_PREFIX + chance.natural({max: TEAM_NAME_MAX_VALUE}),
            Player: team_players
        }
    }
}

function createPlayerPosition(position, nr_players, player_list)
{
    for(var i = 0; i < nr_players; i++)
    {
        var player = {};
        player = createPlayer(player_position[position]);
        //console.log(player);

        player_list.push(player);
    }
}

//TEAMDATA TAG
function createPlayerLineUp(team) {

    //console.log("TEAM:  ");
    //console.log(JSON.stringify(team));
    var matchPlayers = [],
        isCaptain = true,
        status;

    //Iterate each Player
    for(var i = 0; i < team.length; i++)
    {
        //console.log("Player nr " + i + ":   ");
        //console.log(team[i]);

        var player = team[i];

        if(player["-Position"] == player_position.SB)
        {
            status = "Sub";
        } else {
            status = "Start";
        }

        matchPlayers.push(createMatchPlayer(isCaptain, player["-uID"], player["-Position"], i, status));

        //By default the GK is always the Captain
        if(isCaptain)
        {
            isCaptain = false;
        }
    }
    console.log(JSON.stringify(matchPlayers));
}

function createMatchPlayer(isCaptain, playerRef, position, shirtNr, status)
{
    //console.log("createMatchPlayer before stats");
    //console.log("position:  " + position);
    var stats = createMatchPlayer_Stat(position);

    console.log("JAP after stats: " + position);
    return {
        MatchPlayer:{
            "-PlayerRef": playerRef,
            "-Position": position,
            "-ShirtNumber": shirtNr,
            "-Status": status,
            "Stat": stats
        }
    }
}

function createMatchPlayer_Stat(position)
{
    var stats = [],
        elem_stat = {};

    //console.log("JAP begin createMatchPlayer_Stat:  " + position + " , fi");
    //console.log("_Player_Stats[position].length:    " + _Player_Stats[position].length);

    for(var i = 0; i < _Player_Stats[position].length; i++)
    //for(var i = 0; i < 2; i++)
    {
        var elem_stat = {};

        //console.log("JAP inside loop i: " + i);
        elem_stat["-Type"] = _Player_Stats[position][i].description;
        elem_stat["#text"] = chance.natural({min:_Player_Stats[position][i].values.min,
                                             max:_Player_Stats[position][i].values.max});
        stats.push(elem_stat);
    }
    //console.log("AFTER FOR LOOP");

    return stats;

}
//TEAMDATA TAG end

//  GENERAL DATA
function createVenue() {
    return {
        Venue:{
            '-uID': 'v' + chance.natural({max: VENUE_ID_MAX_VALUE}),
            'Country': VENUE_COUNTRY,
            Name: VENUE_NAME + chance.natural({max: VENUE_NAME_MAX_VALUE})
        }
    }
}


//COMPETITION TAG
//TODO: verify syntax for Season Type
function createRound() {
    return {
        "Name": ROUND_NAME,
        "Pool": chance.natural({min: 1, max: ROUND_POOL_MAX_VALUE}),
        "RoundNumber": chance.natural({min: 1, max: ROUND_NUMBER_MAX_VALUE}),

    }
}

function createCompetition() {
    var stats = [],
        season_id = {"-Type": "season_id",
            "#text": COMPETITION_SEASON_ID},

        season_name = {"-Type": "season_name",
            "#text": COMPETITION_SEASON_NAME},

        symid = {"-Type": "symid",
            "#text": COMPETITION_SEASON_SYMID},

        match_day = {"-Type": "matchday",
            "#text": chance.natural({min:1, max: COMPETITION_SEASON_MATCH_DAY_MAX_VALUE})};

    stats.push(season_id);
    stats.push(season_name);
    stats.push(symid);
    stats.push(match_day);

    return {
        "Competition": {
            "-uID": "c" + chance.natural({min:1, max:COMPETITION_MAX_ID_VALUE}),
            "Country": COMPETITION_COUNTRY,
            "Name": COMPETITION_NAME,
            "Round": createRound(),
            "Stat": stats
        }
    }
}
//END COMPETITION TAG

function createSoccerFeed() {

}

//MatchData TAG
function createMatchData() {
    return {
        "MatchInfo": createMatchInfo(),
    }
}

function createMatchInfo() {
    return {
        "-MatchType": MATCH_TYPE,
        "-Period": MATCH_PERIOD,
        "-TimeStamp": TIME_STAMP,
        "Date": TIME_STAMP
    }
}

function  createMatchOfficial() {
    return {
        "-uID": "o" + chance.natural({min:1, max:OFFICIAL_ID_MAX_VALUE}),
        "OfficialData": createOfficialRef(),
        "OfficialName": createPersonName()
    }
}

function createOfficialRef() {
    return {
        "OfficialRef": {
            "-Type": OFFICIAL_TYPE
        }
    }
}

function createTeamData(side, numberGoals) {
    
    var goals = chance.natural({max: TEAM_GOALS_MAX_VALUE});

    return {
        "-Score": goals,
        "-Side": side,
        "-TeamRef": null,
    }
}


//END MatchData tag

////// MAIN FUNCTION: CREATE GAME\\\\\\
function createGame(date) {
    var stats = [],
        match_time = {"-Type": "match_time",
            "#text": chance.natural({min: MATCH_OFFICIAL_TIME_MIN, max: MATCH_OFFICIAL_TIME_MAX})
        },

        first_half_start = {"-Type": "first_half_start",
            "#text": MATCH_OFFICIAL_FH_START
        },

        first_half_time = {"-Type": "first_half_start",
            "#text": chance.natural({min: MATCH_OFFICIAL_FH_TIME_MIN_VALUE, max: MATCH_OFFICIAL_FH_TIME_MAX_VALUE})
        },

        first_half_stop = {"-Type": "first_half_stop",
            "#text": MATCH_OFFICIAL_FH_STOP
        },

        second_half_start = {"-Type": "second_half_start",
            "#text": MATCH_OFFICIAL_SH_START
        };

    stats.push(match_time);
    stats.push(first_half_start);
    stats.push(first_half_time);
    stats.push(first_half_stop);
    stats.push(second_half_start);
    
    //JAP passar a equipa para dentro createTeam()
    var homeTeam = createTeam(),
        awayTeam = createTeam(),
        homePlayerLineUp = createPlayerLineUp(_Teams[0]),
        awayPlayerLineUp = createPlayerLineUp(_Teams[1]);

    return {
        "SoccerFeed": {
         "-TimeStamp": "20150415T000723+0100",
            "SoccerDocument": {
                "-Type": "Latest",
                "-uID": "f" + chance.natural({maX: SOCCER_DOC_MAX_VALUE}),
                "Competition": createCompetition(),
                "MatchOfficial": createMatchOfficial(),
                "Stat": stats
            }
        }
    }
}

/////// FUNCTION CALLS SECTION \\\\\\\\\\\
/*
var homeTeam = createTeam(),
    awayTeam = createTeam(),
    homePlayerLineUp = createPlayerLineUp(_Teams[0]),
    homePlayerLineUp = createPlayerLineUp(_Teams[1]);

    console.log("homeTeam:  ");
    console.log(JSON.stringify(homeTeam));
*/
/////// TEST SECTION \\\\\\\\\\\

//var test_createPlayer = createPlayer(player_position.MF);
//var test_test = createTeam();
//var test_test2 = createTeam();

var test_createMatchPlayer_Stat;
//test_createMatchPlayer_Stat = createMatchPlayer_Stat("GK");
//var test_createMatchPlayer = createMatchPlayer(false, "p169785", "GK2", 1, "Start");
//console.log(JSON.stringify(test_createMatchPlayer_Stat));


//console.log(test_createPlayer);
//console.log(JSON.stringify(test_test));
//console.log(JSON.stringify(_Teams));
//console.log(JSON.stringify(testTeamOfficial));

var game = createGame("data");
console.log("GAME:");
console.log(JSON.stringify(game));