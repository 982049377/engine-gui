class DisplayNode {
    childrens: DisplayNode[];
    name: string
    constructor(name: string) {
        this.childrens = [];
        this.name = name;
    }

    addchild(displaynode: DisplayNode) {
        if (this.childrens.indexOf(displaynode) != -1)
            this.childrens.push(displaynode);
        else
            alert("已存在节点");
    }
    removechild(displaynode: DisplayNode) {
        if (this.childrens.indexOf(displaynode) != -1)
            this.childrens.slice(this.childrens.indexOf(displaynode), 1);
        else
            alert("不存在节点");
    }
}