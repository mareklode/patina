export function getJsonFromLinkedNodeList (root, branchForks, linkedNodeList, deleteProperty = []) {
    let reusableImages = {};

    let reconstructJsonSubtree = (node) => {
        let nodeObject = { ...node };

        deleteProperty.forEach((property) => {
            delete nodeObject[property];
        });

        branchForks.forEach((property) => {
            if (node[property]) {
                if (linkedNodeList[node.reuseId]) {
                    reusableImages[node.reuseId] = reconstructJsonSubtree(linkedNodeList[node.reuseId]);
                } else {
                    nodeObject[property] = reconstructJsonSubtree(linkedNodeList[node[property]]);
                }
            }
        });

        return { ...nodeObject };
    };

    let jsonTree = reconstructJsonSubtree(root);
    return { patina: jsonTree, reusableImages: reusableImages };
}