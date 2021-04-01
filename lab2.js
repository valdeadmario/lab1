const valueIn = (arr, v) => arr.filter((va) => va === v).length;

const matrix = [
    [0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0]
];

const invMatrix = matrix
                .map((item) => item.slice().reverse())
                .slice().reverse();

const p =  [0.64, 0.38, 0.50, 0.51, 0.58];

const pLength = p.length;

if(pLength < 0 ) {
    throw new Error('Empty p list')
}

if(!p.every((value) => value < 1 && value > 0)) {
    throw new Error('Incorrect p list. Possibility must be in range (0, 1]')
}

const start = [];
const end = [];
const route = [];
const routes = [];
const wRoutes = [];

matrix.forEach((item, idx) => {
    if(invMatrix[idx].filter((v) => v === 0).length === pLength) {
        start.push(idx)
    }
    if(item.filter((v) => v === 0).length === pLength) {
        end.push(idx)
    }
})

const getAllRouter = (v, pV) => {
    if(pV !== pLength) {
        if(valueIn(matrix[v].slice(pV), 1) > 0) {
            const id = matrix[v].findIndex((value, idx) => idx >= pV && value === 1)
            route.push(id);
            getAllRouter(id, 0);
        }else {
            if(valueIn(matrix[v], 0) === pLength) {
                routes.push(route.slice())
            }
            const index = route.indexOf(v);
            if (index > -1) {
                route.splice(index, 1);
            }
            if(route.length) {
                getAllRouter(route[route.length - 1], v+1)
            }
        }

    }else {
        const index = route.indexOf(v);
        if (index > -1) {
            route.splice(index, 1);
        }
        if(route.length) {
            getAllRouter(route[route.length - 1], v+1)
        }
    }
}

start.forEach((v) => {
    route.push(v);
    getAllRouter(v,0)
})

const workingRoutes = []

routes.forEach((r) => {
    const cond = [[]];
    p.forEach((_, idx) => {
        if(r.includes(idx)) {
            cond.forEach((__, id) => {
                cond[id].push(1)
            })
        }else {
            cond.push(...JSON.parse(JSON.stringify(cond)))
            cond.forEach((__, id) => {
                if(id < cond.length / 2) {
                    cond[id].push(0)
                    cond[cond.length -id - 1].push(1)
                }
            })
        }
    })

    cond.forEach(item => {
        if(!workingRoutes.find((i) => JSON.stringify(i) === JSON.stringify(item))) {
            workingRoutes.push(item)
        }
    })
})

let res = 0;

workingRoutes.forEach((item) => {
    const lis = item.map((v, idx) => {
        if(v === 1) {
            return p[idx]
        }else {
            return 1 - p[idx]
        }
    })
    res += lis.reduce((acc, v) => acc*v, 1)
})

console.log('System uptime probability: ', res)

