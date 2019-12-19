/* eslint-disable*/

/*****----- 选择器 -----*****/
// 引用
// import { Selector, Finder, StaffFinder, PostFinder, RankFinder } from 'components/Selectors';
// Selector: 枚举值
// StaffFinder: 员工选择
// PostFinder: 职位选择
// RankFinder: 职级选择
// ---- 或者 ----

//<Finder type="staff" />   type: [ staff | post | rank | company ]

/*****----- 选择器 -----*****/

import DMUrl from '../services/enums';

// prettier-ignore
const DD = [
    { code: 'ENUM_XB',          desc: '性别',             alias: 'gender' },
]
const stringValue = ['fiveInsurancesList', 'formCode'];
const DM = DD.filter(i => !i.code).map(i => i.alias);

export const aliasInDM = alias => DM.includes(alias);
export const isStringValue = alias => stringValue.includes(alias);
export const aliasToDMUrl = alias => DMUrl[alias];
export const aliases = DD.map(i => i.alias);
export const aliasToCode = alias => DD.filter(i => i.alias == alias)[0].code;
export const aliasToDD = alias => DD.filter(i => i.alias == alias)[0] || {};
export const codeToAlias = code => (DD.filter(i => i.code == code)[0] || {}).alias;
/**
 * 各类枚举值
 */
// 后台消息中心-消息列表
export default {
  aliasToCode,
  aliasInDM,
  aliasToDMUrl,
  aliasToDD,
};
