import React from 'react';
import './App.css';
import { BiArrowBack } from "react-icons/bi";
import { AiFillEdit, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

async function api({ url, method, headers, data }, option = {}) {
    return fetch(url, {
        method: method || 'GET',
        body: data ? JSON.stringfy(data) : null,
        headers: headers || {
            'content-type': 'application/json'
        },
        mode: 'cors',
        ...option
    }).then(res => {
        if (res.ok) {

            return res.json()
        }
        else {
            console.log("no man")
            return "查無此使用者"
        }

    })
}

class Header extends React.Component {

    constructor(props) {
        super(props)
        this.state = { edit: false }
    }

    handleEdit = (edit) => this.setState({ edit: edit })

    editUser = () => {
        window.location = `/#/user/${document.getElementById("userName").value}`
        window.location.reload()
    }

    render() {
        return (<>
            <div className='header circle'>
                {
                    this.state.edit ? <>
                        <input id='userName'></input>
                        <AiOutlineCheck className="pointer" onClick={ this.editUser } />
                        <AiOutlineClose className="pointer" onClick={ () => this.handleEdit(false) } />
                    </> : <>{ this.props.userName }<AiFillEdit className="pointer" onClick={ () => this.handleEdit(true) } /></>
                }
            </div>

        </>)
    }

}

export class User extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: window.location.hash.split("/user/")[1],
            page: 1,
            check: true
        }
    }

    componentDidMount() {
        this.callRepo(1)
    }
    createItem = (text, where, handle) => {
        let item = document.createElement("div")
        item.setAttribute("class", "items circle")
        item.innerHTML = text
        if (handle) item.onclick = handle
        document.getElementById(where).appendChild(item)
    }

    callRepo = (page) =>
        api({ url: `https://api.github.com/users/${this.state.userName}/repos?per_page=10&page=${page}` })
            .then(datas => {
                if (Array.isArray(datas))
                    datas.forEach((data) =>
                        this.createItem(`<div>name: ${data.name}</div><div>stargazers_count: ${data.stargazers_count}</div>`, "list"
                            , () => this.toRepo(this.state.userName, data.name)))

                else this.createItem(datas, "list")
                this.setState({ check: true })
            })

    handleScroll = (e) => {
        const { clientHeight, scrollHeight, scrollTop } = e.target
        let isBottom = scrollTop + clientHeight + 20 > scrollHeight
        if (isBottom & this.state.check) {
            let newPage = this.state.page + 1
            this.setState({ page: newPage, check: false })
            this.callRepo(newPage)
        }
    }

    toRepo = (userName, repoName) => window.location = `/#/user/${userName}/repos/${repoName}`

    render() {
        return (
            <div >
                <Header userName={ this.state.userName } />
                <div id="list" onScroll={ this.handleScroll } />
            </div>)
    }
}

export class Repo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: window.location.hash.split("/")[2],
            repoName: window.location.hash.split("/")[4]
        }
    }

    componentDidMount() {
        api({ url: `https://api.github.com/repos/${this.state.userName}/${this.state.repoName}` })
            .then(data => this.setState({ datas: data }))
            .catch(e => console.log(e))
    }

    toUser = () => window.location = `/#/user/${this.state.userName}`

    render() {
        return (<>
            <Header userName={ this.state.userName } />
            <div>
                {
                    this.state.datas ? <>
                        <div className='content circle'>
                            <BiArrowBack onClick={ this.toUser } className="pointer" />
                            <div>full_name: { this.state.datas.full_name }</div>
                            <div>description: { this.state.datas.description }</div>
                            <div>stargazers_count: { this.state.datas.stargazers_count }</div>
                        </div>
                    </> : <></>
                }
            </div>
        </>)
    }
}