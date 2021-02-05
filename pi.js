function randomI2() {
	var x = Math.random();
	var y = Math.random();
	return {x:x, y:y}
}

function checkInside(cs) {
	var x = cs.x
	var y = cs.y
	if (x*x+y*y<=1) {
		return 1;
	}
	else {
		return 0;
	}
}

function countOK(N){
	var counter = 0;
	var coordinates_inside = [];
	var coordinates_outside = [];
	for (let i = 0; i < N; i++) {
		cs = randomI2();
		flag = checkInside(cs);
		if (flag == 1) {
			counter += 1;
			coordinates_inside.push(cs);
		}
		else {
			coordinates_outside.push(cs);
		}
	}
	return [counter, coordinates_inside, coordinates_outside];
}

c = 0;
ok = 0;

function PiBtn(myChart) {
	var N = 100;
	c++;
	document.getElementById("pi3").textContent = N*c;
	const [counter, cs_in, cs_out] = countOK(N);
	ok += counter;
	document.getElementById("pi4").textContent = ok;
	var approx_pi = 4*ok/(N*c)
	document.getElementById("pi5").textContent = approx_pi.toFixed(6);
	var error = (approx_pi - Math.PI)/Math.PI*100;
	document.getElementById("pi6").textContent = error.toFixed(3)+"%"
	addData(myChart, cs_in, cs_out);
	tweet(approx_pi.toFixed(6));
}

function resetBtn(myChart) {
	c = 0;
	ok = 0;
	document.getElementById("pi3").textContent = 0;
	document.getElementById("pi4").textContent = 0;
	document.getElementById("pi5").textContent = "-";
	document.getElementById("pi6").textContent = "-";
	removeData(myChart);
	$('tweet_btn').empty();
}

function makeData(N) {
	var num  = [...Array(N+1).keys()];
	var xs = num.map(num => num/N);
	var ys = xs.map(xs => Math.sqrt(1-xs*xs));
	var data = num.map(num => {
		return {
			x:xs[num],
			y:ys[num]
		}
	});
	return data
}

function addData(chart, cs_in, cs_out) {
	cs_in.forEach(data => chart.data.datasets[1].data.push(data));
	cs_out.forEach(data => chart.data.datasets[2].data.push(data));
    chart.update();
}

function removeData(chart) {
	chart.data.datasets[1].data = [];
	chart.data.datasets[2].data = [];
	chart.update();
}

function draw_pi(id) {
	var ctx = document.getElementById(id)
	var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            label: '',
            data: makeData(1000),
            pointRadius: 0,
			fill: false,
          },
          {
            label: 'inside circle',
            data: [],
            showLine: false,
            pointRadius: 1,
			pointBackgroundColor: 'rgb(54, 162, 235)'
          },
		  {
            label: 'outside circle',
            data: [],
            showLine: false,
            pointRadius: 1,
			pointBackgroundColor: 'rgb(255, 99, 132)'
          },
		]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            },
			aspectRatio: 1,
			legend: {
				display: false
			}
        }
    });
	return myChart;
}

function getmypi() {
	var N = 100;
	var approx_pi = 4*ok/(N*c);
	//var approx_pi = 3;
	return 'π='+String(approx_pi.toFixed(6));
}

function tweet(mypi) {
	if (c > 1) {
		$('tweet_btn').empty();
	}
	twttr.widgets.createShareButton(
		"", // shareするurl
		document.getElementById('twitter_btn'),
		{
		  lang: 'ja', // ボタンの表示文字の言語
		  count: 'none',
		  text: mypi, //ツイートする文面
		  size: "large", //ボタンサイズ
		  hashtags: 'pi', // ハッシュタグ
		}
	);
};
