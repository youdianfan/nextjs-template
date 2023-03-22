import axios, {CancelToken} from 'axios';
import intl from 'react-intl-universal';

import Qs from 'qs'
import toast from '@/utils/toast';

import {login} from '@/utils/userManager'

import {getAuthorization, storageRedirectUrl} from '@/utils/storage'

const validationUrls= [
	"/api/base/profile/personal-basic",
	"/api/base/profile/organization-basic",
	"/api/base/profile/organization-combination",
	"/api/base/profile/educations",
	"/api/base/profile/experiences",
	"/api/base/microcard",
	"/api/ques/question",
	"/api/events/activity",
	"/api/ques/answer"
]

const channelMessageUrlReg= /\/api\/rtservice\/channel\/[a-f\d]{4}(?:[a-f\d]{4}-){4}[a-f\d]{12}\/message$/
const editAnswerUrlReg= /\/api\/ques\/answer\/[a-f\d]{4}(?:[a-f\d]{4}-){4}[a-f\d]{12}/
const editQuestionUrlReg= /\/api\/ques\/question\/[a-f\d]{4}(?:[a-f\d]{4}-){4}[a-f\d]{12}/
const editMeetingUrlReg= /\/api\/events\/activity\/[a-f\d]{4}(?:[a-f\d]{4}-){4}[a-f\d]{12}\/change/

const validationLink= {
	"linkedIn": "linkedIn",
	"website": "website",
	"zoomUrl": "zoomUrl",
	"teamsUrl": "teamsUrl",
	"otherUrl": "otherUrl"
}

export const pendingReq = {};


let curTime = 0,
	time = 0,
	intervalTime = 10 * 60 * 1000

const http = axios.create({
	baseURL: window.app.H5_SERVICE_BASE_URL,
	// baseURL: '/',
	paramsSerializer: function (params) {
		return Qs.stringify(params, {
			arrayFormat: 'repeat'
		})
	}
});


http.interceptors.request.use(config => {
	let Authorization = getAuthorization();
	config.headers = {
		...config.headers,
		'Shanda_Platform': 'Normal',
		'Shanda_Identity': localStorage.getItem('uuid')
	}
	if (/\/connect\//.test(config.url)) {
		config.baseURL = window.app.H5_SERVICE_AUTH_BASE_URL
	}
	// 频繁操作时，取消同一个接口的前一次请求
	if (!config.noNeedCancel) {
		const key = config.url + '&' + config.method;
		pendingReq[key] && pendingReq[key]('The operation is too frequent~');
		
		let draftKey = '/api/services/app/ActivityDraft/GetAll&get',
			mineKey = '/api/services/app/Activity/GetAllMine&get',
			recommendKey = '/api/services/app/Activity/GetAllRecommend&get',
			tagKey = '/api/fullsearch/document/search-with-tag&get'
		
		if (key == mineKey) {
			pendingReq[`${draftKey}`] && pendingReq[`${draftKey}`]('The operation is too frequent~');
			pendingReq[`${recommendKey}`] && pendingReq[`${recommendKey}`]('The operation is too frequent~');
		}
		
		if (key == recommendKey) {
			pendingReq[`${draftKey}`] && pendingReq[`${draftKey}`]('The operation is too frequent~');
			pendingReq[`${mineKey}`] && pendingReq[`${mineKey}`]('The operation is too frequent~');
		}
		
		if (key == draftKey) {
			pendingReq[`${recommendKey}`] && pendingReq[`${recommendKey}`]('The operation is too frequent~');
			pendingReq[`${mineKey}`] && pendingReq[`${mineKey}`]('The operation is too frequent~');
		}
		
		
		config.cancelToken = new CancelToken((c) => {
			pendingReq[key] = c;
		});
	}
	
	if (Authorization) {
		config.headers = {
			...config.headers,
			Authorization: `Bearer ${Authorization}`,
		};
	}
	
	if (config.method !== 'get') {
		if (config.url != '/file/upload' && config.url != '/connect/token') {
			config.data = {
				...config.data,
			}
		}
	} else if (config.method === 'get') {
		config.params = {
			...config.params
		}
	}
	
	return config;
}, (error) => {
	// 对请求错误做些什么
	
	return Promise.reject(error);
});

http.interceptors.response.use(response => {
	if (!response.noNeedCancel) {
		const key = response.config.url + '&' + response.config.method;
		pendingReq[key] && delete pendingReq[key];
	}
	return response;
}, err => {
	
	let errResponse = err?.response ?? {}
	
	if (errResponse?.config?.method == 'get') {
		let eventsIndex = errResponse.config.url.indexOf('/api/events/activity/')
		let answerIndex = errResponse.config.url.indexOf('/api/ques/answer/')
		let questionIndex = errResponse.config.url.indexOf('/api/ques/question/')
		let userIndex = errResponse.config.url.indexOf('/api/base/profile/')
		if (eventsIndex == 0 || answerIndex == 0 || questionIndex == 0 || userIndex == 0) {
			return Promise.reject(errResponse);
		}
	}
	// 阻止弱关联知识图谱报错
	if (errResponse?.status == 404 && errResponse?.config?.params?.TopCount) {
		return Promise.reject(errResponse);
	}
	
	// 阻止知识图谱点击报错
	if (errResponse?.status == 404 && errResponse?.config?.err) {
		return Promise.reject(errResponse);
	}
	
	if (errResponse?.status == 401) {
		curTime = new Date();
		if (curTime - time > intervalTime) {
			time = curTime;
			// sessionStorage.removeItem('redirect');
			// const pathname = location.pathname,
			// 	search = location.search
			// const redirectUrl = encodeURI(pathname + search)
			// window.localStorage.removeItem('USER_INFO')
			// storageRedirectUrl(redirectUrl)
			toast({msg: intl.get('login_expired')})
			setTimeout(login, 300)
		}
		return Promise.reject(errResponse);
	}
	if (errResponse?.status == 403 && errResponse?.data?.error?.code == 'Shanda.NQues.ActivityManagement:002009') {
		return Promise.reject(errResponse);
	}
	
	
	if (errResponse?.status === 500 && errResponse?.data && errResponse?.data?.error && errResponse?.data?.error?.code === 2009) {
		location.href = '/404'
		return Promise.reject(errResponse);
	}
	
	if (errResponse?.status === 500 && errResponse?.data && errResponse?.data?.error && errResponse?.data?.error?.code === 3) {
		toast({msg: errResponse?.data && errResponse?.data?.error && errResponse?.data?.error?.message || errResponse?.data?.error_description || errResponse?.statusText || intl.get('tips_net')})
		
		const pathname = location.pathname,
			search = location.search
		const redirectUrl = pathname + search
		storageRedirectUrl(redirectUrl)
		setTimeout(() => {
			location.href = '/user/identity'
		}, 300)
		
		
	}
	if (errResponse?.status === 500 && errResponse?.data && errResponse?.data?.error && errResponse?.data?.error?.code === 1) {
		toast({msg: errResponse?.data && errResponse?.data?.error && errResponse?.data?.error?.message || errResponse?.data?.error_description || errResponse?.statusText || intl.get('tips_net')})
		setTimeout(() => {
			location.href = '/'
		}, 300)
	}
	
	if (
		errResponse.status == 400 &&
		(validationUrls.includes(errResponse?.config?.url) || channelMessageUrlReg.test(errResponse?.config?.url) || editAnswerUrlReg.test(errResponse?.config?.url) || editQuestionUrlReg.test(errResponse?.config?.url) || editMeetingUrlReg.test(errResponse?.config?.url)) &&
		errResponse?.data?.error?.validationErrors?.length > 0
	) {
		let validationErrors = errResponse?.data?.error?.validationErrors ?? []
		let isLink = validationErrors.some(validationError => validationError?.members?.[0] && validationLink?.[`${validationError?.members?.[0]}`])
		let msg = isLink ? intl.get('link_illegal_tips') : intl.get('illegal_tips')
		setTimeout(() => {
			toast({msg})
		}, 1200)
		return Promise.reject(errResponse);
	}
	
	if (err?.message == 'The operation is too frequent~' || err?.message == 'page unmount') {
		return Promise.reject('')
	}
	
	
	setTimeout(() => {
		toast({msg: errResponse?.data && errResponse?.data?.error && errResponse?.data?.error?.message || errResponse?.data?.error_description || errResponse?.statusText || intl.get('tips_net')})
	}, 1200)
	return Promise.reject(errResponse);
	
})
export default http
