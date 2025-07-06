export default class SimpleCache {
    static #instance = null;


    // (userID , {userName: '', imagePath:''})
    #Users = new Map();
    // (pageNumber ,[projectMemberID: number,permission: number,userID: number])
    #ProjectMembers = new Map();
    // (pageNumber ,[chatMemberID: number,permission: number,userID: number])
    #ChatMembers = new Map();

    // (pageNumber ,[taskMemberID: number,permission: number,userID: number])
    #TaskChatMembers = new Map();

    // (pageNumber ,[{projectMemberID: number,permission: number,userID: number},{}])
    #ProjectMembersOfUpdateTask = new Map();

    constructor() {
        if (SimpleCache.#instance) {
            return SimpleCache.#instance;
        }

        SimpleCache.#instance = this;
    }

    setUser(key, value) {
        this.#Users.set(key, value);
    }

    getUser(key) {
        return this.#Users.get(key);
    }


    //project
    setProjectMember(key, value) {
        if (!this.#ProjectMembers.has(key)) {
            this.#ProjectMembers.set(key, []);
        }
        this.#ProjectMembers.get(key).push(value);
    }
    IsExistProjectMemberPage(pageNumber) {
        return this.#ProjectMembers.has(pageNumber);
    }
    getProjectMember(pageNumber) {
        const data = this.#ProjectMembers.get(pageNumber);
        const List = [];
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const user = this.getUser(element.userID);

            const ProjectMember = {
                projectMemberID: element.projectMemberID,
                userID: element.userID,
                permission: element.permission,
                userName: user.userName,
                imagePath: user.imagePath
            }
            List.push(ProjectMember);
        }

        return List;
    }
    setListData(pageNumber, List = []) {
        for (let index = 0; index < List.length; index++) {
            const element = List[index];

            const ProjectMember = {
                projectMemberID: element.projectMemberID,
                userID: element.userID,
                permission: element.permission
            }

            const User = {
                userName: element.userName, imagePath: element.imagePath
            }

            this.setProjectMember(pageNumber, ProjectMember);
            this.setUser(element.userID, User);
        }

    }


    //chat 
    setChatMember(key, value) {
        if (!this.#ChatMembers.has(key)) {
            this.#ChatMembers.set(key, []);
        }
        this.#ChatMembers.get(key).push(value);
    }
    IsExistChatMemberPage(pageNumber) {
        return this.#ChatMembers.has(pageNumber);
    }
    getChatMember(pageNumber) {
        const data = this.#ChatMembers.get(pageNumber);
        const List = [];
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const user = this.getUser(element.userID);

            const ChatMember = {
                chatMemberID: element.chatMemberID,
                userID: element.userID,
                permission: element.permission,
                userName: user.userName,
                imagePath: user.imagePath
            }
            List.push(ChatMember);
        }

        return List;
    }
    setListDataOfChat(pageNumber, List = []) {
        for (let index = 0; index < List.length; index++) {
            const element = List[index];

            const ProjectMember = {
                chatMemberID: element.chatMemberID,
                userID: element.userID,
                permission: element.permission
            }

            const User = {
                userName: element.userName, imagePath: element.imagePath
            }

            this.setChatMember(pageNumber, ProjectMember);
            this.setUser(element.userID, User);
        }

    }


    //Project Of Update Task
    setProjectMemberUpdateTask(key, value) {
        if (!this.#ProjectMembersOfUpdateTask.has(key)) {
            this.#ProjectMembersOfUpdateTask.set(key, []);
        }
        this.#ProjectMembersOfUpdateTask.get(key).push(value);
    }
    IsExistProjectMemberPageUpdateTask(pageNumber) {
        return this.#ProjectMembersOfUpdateTask.has(pageNumber);
    }
    setListDataUpdateTask(pageNumber, List = []) {
        for (let index = 0; index < List.length; index++) {
            const element = List[index];

            const ProjectMember = {
                projectMemberID: element.projectMemberID,
                userID: element.userID,
                permission: element.permission
            }

            const User = {
                userName: element.userName, imagePath: element.imagePath
            }

            this.setProjectMemberUpdateTask(pageNumber, ProjectMember);
            this.setUser(element.userID, User);
        }

    }
    getProjectMemberUpdateTask(pageNumber) {
        const data = this.#ProjectMembersOfUpdateTask.get(pageNumber);
        const List = [];
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const user = this.getUser(element.userID);

            const ProjectMember = {
                projectMemberID: element.projectMemberID,
                userID: element.userID,
                permission: element.permission,
                userName: user.userName,
                imagePath: user.imagePath
            }
            List.push(ProjectMember);
        }

        return List;
    }
    deleteProjectMember(projectMemberID) {
        for (const [pageNumber, members] of this.#ProjectMembers.entries()) {
            const filtered = members.filter(member => member.projectMemberID !== projectMemberID);
            this.#ProjectMembers.set(pageNumber, filtered);
        }
    }

    //Task chat 
    setTaskChatMember(key, value) {
        if (!this.#TaskChatMembers.has(key)) {
            this.#TaskChatMembers.set(key, []);
        }
        this.#TaskChatMembers.get(key).push(value);
    }
    IsExistTaskChatMemberPage(pageNumber) {
        return this.#TaskChatMembers.has(pageNumber);
    }
    getTaskChatMember(pageNumber) {
        const data = this.#TaskChatMembers.get(pageNumber);
        const List = [];
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const user = this.getUser(element.userID);
            const ChatMember = {
                chatMemberID: element.taskMemberID,
                userID: element.userID,
                permission: element.permission,
                userName: user.userName,
                imagePath: user.imagePath
            }
            List.push(ChatMember);
        }

        return List;
    }
    setListDataOfTaskChat(pageNumber, List = []) {
        for (let index = 0; index < List.length; index++) {
            const element = List[index];

            const ProjectMember = {
                chatMemberID: element.taskMemberID,
                userID: element.userID,
                permission: element.permission
            }

            const User = {
                userName: element.userName, imagePath: element.imagePath
            }

            this.setTaskChatMember(pageNumber, ProjectMember);
            this.setUser(element.userID, User);
        }

    }

    clearAllMemberData() {
        this.#ProjectMembers.clear();
        this.#ChatMembers.clear();
        this.#TaskChatMembers.clear();
        this.#ProjectMembersOfUpdateTask.clear();
    }

}
