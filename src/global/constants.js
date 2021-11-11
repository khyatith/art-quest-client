/* eslint-disable import/prefer-default-export */
//export const API_URL = 'https://art-quest-server-new.herokuapp.com';
export const API_URL = 'http://localhost:3001'
export const TEAM_DETAILS = [{
  id: 0,
  name: 'Blue',
  color: '#85C1E9',
}, {
  id: 1,
  name: 'Red',
  color: '#D98880',
}, {
  id: 2,
  name: 'Yellow',
  color: '#F7DC6F',
}, {
  id: 3,
  name: 'Green',
  color: '#7DCEA0',
}, {
  id: 4,
  name: 'Purple',
  color: '#C39BD3',
}, {
  id: 5,
  name: 'Orange',
  color: '#E59866',
}, {
  id: 6,
  name: 'Pink',
  color: '#FFC0CB',
}];

export const TEAM_COLOR_MAP = {
  Blue: '#85C1E9',
  Red: '#D98880',
  Yellow: '#F7DC6F',
  Green: '#7DCEA0',
  Purple: '#C39BD3',
  Orange: '#E59866',
  Pink: '#FFC0CB',
};

export const ALL_PAY_AUCTIONS_TEXT = 'The highest bid will win. But all the teams will pay the amount that they bid';
export const FIRST_PRICED_SEALED_BID_TEXT = 'The highest bid will win. You cannot see the bid of the other teams';
export const SECOND_PRICED_SEALED_BID_TEXT = 'The highest bid will win. But the winner will pay the amount of the second-highest bid';
