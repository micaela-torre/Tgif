const camara = document.title.includes('Senate') ?
        'senate' :
        'house'

let init = {
        headers: {
                'X-API-Key': 'dqY75AHbRFeTKF2GollgVVhkoaDqFugKlZLv7zQy'
        }
}

fetch(`https://api.propublica.org/congress/v1/113/${camara}/members.json`, init)
        .then(res => res.json())
        .then(json => {

                fechear(json.results[0].members)
        })
        .catch(err => console.log(err.message))

const fechear = (miembros => {

        if (document.title == "Home") {
                let button = document.getElementById('button')
                button.addEventListener('click', (e) => {
                        button.innerText = button.innerText == 'Read More' ? 'Read Less' : 'Read More'
                })

        } else {
                if (document.title == "House" || document.title == "Senate") {
                        var filtroEstado = "todos"
                        var filtroPartido = ["D", "R", "ID"]
                        var infoAMostrar = []
                        var infoAMostrarDefinitiva = []
                        const filasBody = document.getElementById("filas")
                        miembros.forEach((miembro) => miembro.middle_name == null ? miembro.middle_name = "" : "")
                        var states = []
                        miembros.forEach(miembro => {
                                if (!states.includes(miembro.state)) {
                                        states.push(miembro.state)
                                }
                        })
                        states = states.sort()
                        states.forEach(state => {
                                const opcion = document.createElement("option")
                                opcion.innerText = state
                                opcion.value = state
                                const select = document.getElementById('select')
                                select.appendChild(opcion)
                        })

                        function leerFiltros() {
                                if (filtroEstado == "todos") {
                                        infoAMostrar = miembros
                                } else {
                                        infoAMostrar = miembros.filter(miembro => miembro.state == filtroEstado)
                                }
                                infoAMostrarDefinitiva = []
                                infoAMostrar.forEach(miembro => {
                                        let partido = miembro.party
                                        if (partido === "D" && filtroPartido.includes("D")) {
                                                infoAMostrarDefinitiva.push(miembro)
                                        } else if (partido === "R" && filtroPartido.includes("R")) {
                                                infoAMostrarDefinitiva.push(miembro)
                                        } else if (partido === "ID" && filtroPartido.includes("ID")) {
                                                infoAMostrarDefinitiva.push(miembro)
                                        }
                                })
                        }
                        crearTabla()

                        function crearTabla() {
                                document.getElementById('filas').innerHTML = ''
                                leerFiltros()
                                infoAMostrarDefinitiva.forEach((miembro) => {
                                        const fila = document.createElement("tr")
                                        let infoName = document.createElement("td")
                                        let names = `${miembro.last_name} ${miembro.first_name} ${miembro.middle_name}` //VAR DE NOMBRES
                                        infoName.innerHTML = names.link(miembro.url)
                                        fila.appendChild(infoName)
                                        const infoParty = document.createElement("td")
                                        infoParty.innerText = miembro.party
                                        fila.appendChild(infoParty)
                                        const infoState = document.createElement("td")
                                        infoState.innerText = miembro.state
                                        fila.appendChild(infoState)
                                        const infoSeniority = document.createElement("td")
                                        infoSeniority.innerText = miembro.seniority
                                        fila.appendChild(infoSeniority)
                                        const infoVotes = document.createElement("td")
                                        infoVotes.innerText = `${miembro.votes_with_party_pct.toFixed(2)} %`
                                        fila.appendChild(infoVotes)
                                        filasBody.appendChild(fila)
                                })
                        }

                        let checkParty = document.querySelectorAll("input[type ='checkbox']")
                        checkParty = Array.from(checkParty)
                        checkParty.forEach(check => {
                                check.addEventListener('change', (e) => {
                                        let queCheck = e.target.value
                                        let estaChequeado = e.target.checked
                                        if (filtroPartido.includes(queCheck) && !estaChequeado) {
                                                filtroPartido = filtroPartido.filter(partido => partido !== queCheck)
                                        } else if (!filtroPartido.includes(queCheck) && estaChequeado) {
                                                filtroPartido.push(queCheck)
                                        }
                                        crearTabla()
                                })
                        })

                        document.getElementById('select').addEventListener('change', (e) => {
                                let estadoElegido = e.target.value
                                filtroEstado = estadoElegido
                                crearTabla()
                        })
                } else {
                        miembros.forEach((miembro) => miembro.middle_name == null ? miembro.middle_name = "" : "")
                        let statistics = {
                                democrats: [],
                                numberD: 0,
                                republicans: [],
                                numberR: 0,
                                independents: [],
                                numberI: 0,
                                mostLoyal: [], // 10% de rep con mas votos c/ su partido // MAYOR A MENOR
                                leastLoyal: [], // 10% de rep con menos votos c/ su partido // MENOR A MAYOR
                                mostEngaged: [], // 10% de rep con menos votos perdidos // MENOR A MENOR
                                leatsEngaged: [], // 10% de rep con mas votos perdidos // MAYOR A MAYOR
                                missedVotesDemocrats: 0, //porcentaje de votos perdidos de los democratas 
                                missedVotesRepublicans: 0,
                                votesPartyDemocrats: 0,
                                votesPartyRepublicans: 0,
                                total: miembros.length
                        }
                        statistics.democrats = miembros.filter(miembro => miembro.party === "D")
                        statistics.republicans = miembros.filter(miembro => miembro.party === "R")
                        statistics.independents = miembros.filter(miembro => miembro.party === "ID")
                        statistics.numberI = statistics.independents.length
                        statistics.numberR = statistics.republicans.length
                        statistics.numberD = statistics.democrats.length
                        var missedVotesDemo = []
                        var missedVotesRepu = []
                        var votesPartyDemo = []
                        var votesPartyRepu = []

                        function percentage(prop, array, prop2, prop3, nroP) {
                                statistics[prop].forEach(nro => array.push(nro[prop2]))
                                array = array.reduce((a, b) => a + b / statistics[nroP], 0)
                                statistics[prop3] = array.toFixed(2)
                        }
                        percentage("republicans", missedVotesRepu, "missed_votes_pct", "missedVotesRepublicans", "numberR")
                        percentage("democrats", missedVotesDemo, "missed_votes_pct", "missedVotesDemocrats", "numberD")
                        percentage("democrats", votesPartyDemo, "votes_with_party_pct", "votesPartyDemocrats", "numberD")
                        percentage("republicans", votesPartyRepu, "votes_with_party_pct", "votesPartyRepublicans", "numberR")
                        console.log(statistics.votesPartyDemocrats)

                        if (document.getElementById("t-bodyHouseP")) {
                                pintarFilas("Democrats", statistics.numberD, statistics.missedVotesDemocrats + "%", "t-bodyHouseP")
                                pintarFilas("Republicans", statistics.numberR, statistics.missedVotesRepublicans + "%", "t-bodyHouseP")
                                pintarFilas("Independents", statistics.numberI, "-", "t-bodyHouseP")
                                pintarFilas("Total", statistics.total, "-", "t-bodyHouseP")

                        } else {
                                pintarFilas("Democrats", statistics.numberD, statistics.votesPartyDemocrats + "%", "t-bodyHouseA")
                                pintarFilas("Republicans", statistics.numberR, statistics.votesPartyRepublicans + "%", "t-bodyHouseA")
                                pintarFilas("Independents", statistics.numberI, "-", "t-bodyHouseA")
                                pintarFilas("Total", statistics.total, "-", "t-bodyHouseA")
                        }

                        function pintarFilas(nombre, numero, porcentaje, padre) {
                                let fila = document.createElement("tr")
                                let party = document.createElement("td")
                                party.innerText = nombre
                                let nDem = document.createElement("td")
                                nDem.innerText = numero
                                let missedDem = document.createElement("td")
                                missedDem.innerText = porcentaje
                                fila.appendChild(party)
                                fila.appendChild(nDem)
                                fila.appendChild(missedDem)
                                document.getElementById(padre).appendChild(fila)
                        }

                        var diezPorCiento = Math.ceil((statistics.total * 0.1))

                        var numOrder = miembros.filter(miembro => miembro.total_votes !== 0).sort((a, b) => b.votes_with_party_pct - a.votes_with_party_pct)
                        statistics.mostLoyal = numOrder.slice(0, diezPorCiento)

                        var numOrder2 = miembros.filter(miembro => miembro.total_votes !== 0).sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct)
                        statistics.leastLoyal = numOrder2.slice(0, diezPorCiento)

                        var numOrder3 = miembros.filter(miembro => miembro.total_votes !== 0).sort((a, b) => a.missed_votes_pct - b.missed_votes_pct)
                        statistics.mostEngaged = numOrder3.slice(0, diezPorCiento)

                        var numOrder4 = miembros.filter(miembro => miembro.total_votes !== 0).sort((a, b) => b.missed_votes_pct - a.missed_votes_pct)
                        statistics.leastEngaged = numOrder4.slice(0, diezPorCiento)

                        if (document.title.includes("Attendance")) {
                                crearTable(statistics, "mostEngaged", "filas", "missed_votes_pct")
                                crearTable(statistics, "leastEngaged", "filas2", "missed_votes_pct")
                        } else {
                                crearTable(statistics, "mostLoyal", "filas4", "votes_with_party_pct")
                                crearTable(statistics, "leastLoyal", "filas3", "votes_with_party_pct")
                        }

                        function crearTable(obj, prop, padre2, prop3) {
                                obj[prop].forEach((voto) => {
                                        let fila = document.createElement("tr")
                                        let infoName = document.createElement("td")
                                        let names = `${voto.last_name} ${voto.first_name} ${voto.middle_name}`
                                        infoName.innerHTML = names.link(voto.url)
                                        fila.appendChild(infoName)
                                        let votosConP = Math.round((voto.total_votes - voto.missed_votes) * voto.votes_with_party_pct / 100)
                                        let nroVotes = document.createElement("td")
                                        if (document.title.includes("Attendance")) {
                                                nroVotes.innerText = voto.missed_votes
                                        } else {
                                                nroVotes.innerText = votosConP
                                        }
                                        fila.appendChild(nroVotes)
                                        let infoVotes = document.createElement("td")
                                        infoVotes.innerText = voto[prop3].toFixed(2) + "%"
                                        fila.appendChild(infoVotes)
                                        document.getElementById(padre2).appendChild(fila)
                                })
                        }
                }
        }
})