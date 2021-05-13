import Api from '../services/api'

export const loadInfo = async (i: any, setInfo: any) => {
    setInfo(JSON.parse(localStorage.getItem("info") || JSON.stringify(i)))
    Api.get(`/api/config?name=info`).then(response => {
        setInfo(response.data?.result?.content)
        localStorage.setItem("info", JSON.stringify(response.data?.result?.content))
    })
}

export const loadUser = async (setUser: any) => {
    return await Api.get('/api/auth').then(response => {
        setUser({user: response.data?.user, loading: false, allowed: response.data.user !== {}})
    })
}