function generateInputs() {
    const count = parseInt(document.getElementById("processCount").value);
    const form = document.getElementById("processForm");
    form.innerHTML = "";
  
    for (let i = 0; i < count; i++) {
      form.innerHTML += `
        <div>
          <label>Process ${i+1} : Arrival Time: <input type="number" min="0" required id="at${i}"></label>
          <label>Burst Time: <input type="number" min="1" required id="bt${i}"></label>
          <label>Priority (lower = higher): <input type="number" min="0" required id="pr${i}"></label>
        </div>`;
    }
  }
  
  function runScheduler() {
      const count = parseInt(document.getElementById("processCount").value);
      let processes = [];
    
      for (let i = 0; i < count; i++) {
        const arrival = parseInt(document.getElementById(`at${i}`).value);
        const burst = parseInt(document.getElementById(`bt${i}`).value);
        const priority = parseInt(document.getElementById(`pr${i}`).value);
    
        if (isNaN(arrival) || isNaN(burst) || isNaN(priority) || arrival < 0 || burst <= 0 || priority < 0) {
          alert(`Invalid input in process ${i + 1}`);
          return;
        }
    
        processes.push({
          id: `P${i + 1}`,
          at: arrival,
          bt: burst,
          remaining: burst,
          pr: priority,
          rt: -1,
          ct: 0
        });
      }
    
      // Preemptive Priority Scheduling
      let time = 0, completed = 0;
      let gantt = [];
    
      while (completed < count) {
        let idx = -1;
        let minPr = Infinity;
    
        for (let i = 0; i < count; i++) {
          if (processes[i].at <= time && processes[i].remaining > 0 && processes[i].pr < minPr) {
            minPr = processes[i].pr;
            idx = i;
          }
        }
    
        if (idx !== -1) {
          if (processes[idx].rt === -1) processes[idx].rt = time;
          processes[idx].remaining--;
          gantt.push(processes[idx].id);
    
          if (processes[idx].remaining === 0) {
            completed++;
            processes[idx].ct = time + 1;
          }
        } else {
          gantt.push("Idle");
        }
    
        time++;
      }
    
      // Calculate Times
      let output = "<h3>Results:</h3><table border='1'><tr><th>Process</th><th>AT</th><th>BT</th><th>PR</th><th>CT</th><th>WT</th><th>TAT</th><th>RT</th></tr>";
      let totalWT = 0, totalTAT = 0, totalRT = 0;
    
      for (let p of processes) {
        const tat = p.ct - p.at;
        const wt = tat - p.bt;
        const rt = p.rt - p.at;
    
        totalWT += wt;
        totalTAT += tat;
        totalRT += rt;
    
        output += `<tr><td>${p.id}</td><td>${p.at}</td><td>${p.bt}</td><td>${p.pr}</td><td>${p.ct}</td><td>${wt}</td><td>${tat}</td><td>${rt}</td></tr>`;
      }
    
      output += `</table>
        <p>Average WT: ${(totalWT / count).toFixed(2)}</p>
        <p>Average TAT: ${(totalTAT / count).toFixed(2)}</p>
        <p>Average RT: ${(totalRT / count).toFixed(2)}</p>`;
    
      document.getElementById("results").innerHTML = output;
    
      // Gantt Chart
      const chart = document.getElementById("ganttChart");
      chart.innerHTML = "";
      gantt.forEach(p => {
        const div = document.createElement("div");
        div.className = "gantt-block";
        div.innerText = p;
        chart.appendChild(div);
      });
  }
  