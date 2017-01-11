
var drug1nSample = angular.module("drug1nSample", ['ui.bootstrap', 'sampleSrv']);

var    AppCtrl    =  ['$scope', 'dialogServices', 'dataServices','$http',
	function AppCtrl($scope,   dialogServices, dataServices,$http)    {

		$scope.context = 'drug1N';

		$scope.p ={}
		$scope.score = function()  {
			dataServices.getScore($scope.context, $scope.p)
				.then(
					function(rtn) {
						if (rtn.status == 200){
							console.log("Results" +  JSON.stringify(rtn.data));
							var result = rtn.data[0].data[0][5];
							if(result == "" || result == undefined || result == null) {
								$http({
									url:'/getValue',
									method:'POST',
									data:{
										director: $scope.p.Director,
										actor: $scope.p.Actor,
										genre: $scope.p.Genre
									}
								}).success(function(data){
									if(data.statusCode==200)
									{
										rtn.data[0].data[0][5] = data.result;
										rtn.data[0].data[0][6] = 0.651;
										$scope.showResults(rtn.data);
										$scope.predChart(result);
									}
									else {
										$scope.showError("Insufficient dataset to predict for given values");
										console.log("darn");
									}

								}).error(function(error){

									console.log("try somthing elsel");
								});


							} else {

								if(rtn.data[0].data[0][6] < 0.1) {
									rtn.data[0].data[0][6] = rtn.data[0].data[0][6] * 10;
								}

								$scope.showResults(rtn.data);
								$scope.predChart(result);
							}
							// success

						} else {
							//failure
							$scope.showError(rtn.data.message);
						}
					},
					function(reason) {
						$scope.showError(reason);
					}
				);
		};

		$scope.showResults = function(rspHeader, rspData) {
			dialogServices.resultsDlg(rspHeader, rspData).result.then();

		};

		$scope.showError = function(msgText) {
			dialogServices.errorDlg("Error", msgText).result.then();
		};

		$scope.value="";
		$scope.directors=["Seth MacFarlane","Stephen Chow","Sergio Leone","Barry Sonnenfeld","Kat Coiro","Robert Rodriguez","Richard Marquand","John Maclean","Mike Judge","Ridley Scott","Amy Berg","Kirk De Micco","Marc Caro","George Lucas","Terry Gilliam","Irvin Kershner","J.J. Abrams","Jonathan Frakes","Nicholas Meyer","Jon Turteltaub","Jabbar Raisani","Stanley Kubrick","Francis Ford Coppola","Richard Curtis","Shinichirô Watanabe","Matty Beckerman","Seth Kramer","Colin Trevorrow","Fede Alvarez","Stephen Hopkins","John Madden","John Hamburg","Jean-Marc Vallée","Jean-Pierre Dardenne","Michael Winterbottom","Peter Weir","Edward Zwick","Irwin Winkler","James Watkins","Tim Burton","Gus Van Sant","Paul Thomas Anderson","Pierre Morel","Sam Raimi","Robert Altman","Glenn Ficarra","Jon Favreau","Bo Welch","Clint Eastwood","Lee Tamahori","Rupert Wyatt","Jonathan Dayton","Edgar Wright","Dennis Dugan","Steven Spielberg","Michael Curtiz","Stephan Elliott","Álex de la Iglesia","Des McAnuff","John Turturro","Matt Reeves","Roger Christian","Jim Sharman","Robert Redford","Thor Freudenthal","Masato Harada","Christopher Guest","Graham Baker","Mike Newell","Lukas Moodysson","Gore Verbinski","Harald Zwart","Gary Trousdale","Zack Snyder","Marcus Nispel","Jean-Pierre Jeunet","Sidney Lumet","Ron Clements","Clarence Yiu-leung Fok","Garry Marshall","Antony Hoffman","Jorge Blanco","David Fincher","Paul W.S. Anderson","George Roy Hill","Bobby Farrelly","Takashi Miike","Noam Murro","David Zucker","Marc Forster","Christopher McQuarrie","Julius Avery","Bob Odenkirk","Tobe Hooper","Wes Anderson","Jonathan Liebesman","Walter Murch","Shawn Levy","Mark Illsley","Cal Brunker","Stephen Herek","Matthew Diamond","Terry Zwigoff","Sean Penn","Walt Becker","James Ivory","Penelope Spheeris","John McNaughton","Spike Jonze","Damián Szifrón","Benh Zeitlin","F. Gary Gray","Robert Luketic","Luis Estrada","Jaume Collet-Serra","Rachid Bouchareb","Andy Wachowski","Martin Scorsese","Steve Bendelack","Michael Bay","Brad Peyton","Jennifer Flackett","Raymond De Felitta","M. Night Shyamalan","Scott Derrickson","Eric Brevig","Mike Cahill","Martin Brest","Nick Cassavetes","John Lasseter","Simon Curtis","Tom Harper","John Lee Hancock","Lucky McKee","Don Roos","Sofia Coppola","David Lynch","Joel Schumacher","John Hughes","Tony Scott","Joe Dante","Catherine Breillat","Guillermo del Toro","Joel Zwick","Shion Sono","Rob Minkoff","Ron Howard","Robert Schwentke","Paul Weitz","Curtis Hanson","Steven Brill","Mark Dindal","Michael Pavone","Frank Oz","Victor Fleming","Scott Cooper","Craig Gillespie","David O. Russell","Matt Williams","Jacques Audiard","Joel Coen","Mick Jackson","Don Hall","Penny Marshall","Raja Gosnell","Andrew Niccol","Steve Pink","Simon Wells","Justin Chadwick","Ashutosh Gowariker","Niels Arden Oplev","Laurie Collyer","Luke Greenfield","Jacques Becker","James Mangold","Daniel Alfredson","P.J. Hogan","Peter Webber","James Cameron","Harold Ramis","Roland Emmerich","Antoine Fuqua","Mark Romanek","Rawson Marshall Thurber","John Moore","Alan Taylor","Koen Mortier","Michael Apted","Chuck Parello","Trey Parker","Terrence Malick","David Slade","Marc Webb","George Clooney","Charles Laughton","James Gray","Shane Black","Barry Levinson","J.T.S. Moore","Lee Unkrich","Olivier AssayasDoyle","Tom Tykwer","Anna Boden","Wolfgang Petersen","Bob Clark","Ang Lee","Roberto Benigni","Terry Jones","Ben Stiller","Jan de Bont","Mathieu Kassovitz","Matt Piedmont","James L. Brooks","Greg Berlanti","John Erick Dowdle","Steve Carr","Michael Davis","Sean Anders","Lloyd Kaufman","Errol Morris","Vishal Bhardwaj","Federico Fellini","Andrzej Bartkowiak","R.J. Cutler","Andrew Adamson","Billy Morrissette","Doug Liman","Christophe Honoré","Alex Garland","Jaco Van Dormael","Peter Jackson","Anthony Minghella","Bruce A. Evans","Mark Waters","Ryan White","Yann Samuell","Florin Serban","Michael Dowse","Todd Phillips","Robert Zemeckis","Darren Lynn Bousman","Paolo Sorrentino","Michael Radford","Scott Hamilton Kennedy","Nicolas Rossier","Olivier Dahan","Luc Besson","Danis Tanovic","Ethan Coen","Ivan Reitman","Scott Hicks","Guillaume Canet","Miguel Arteta","So Yong Kim","Billy Kent","Hatsuki Tsuji","Sam Mendes","Roman Coppola","Chris Evans","Danny Leiner","Mike Leigh","Rowan Joffe","Don Bluth","Jean-Pierre Melville","Paul Feig","Aki Kaurismäki","Daniel Cohen","Pedro Almodóvar","Jim Field Smith","Alfonso Cuarón","Stéphane Lafleur","Anders Østergaard","Des Doyle","Jake Kasdan","Kevin Greutert","Ken Loach","Michel Gondry","Troy Nixey","Alison Klayman","Francis Lawrence","Luca Guadagnino","Andreas Johnsen","D.J. Caruso","Jessie Nelson","Jesse Peretz","Robert Bresson","Davis Guggenheim","Lone Scherfig","Taylor Hackford","John Landis","Lasse Hallström","Carlos Carrera","Bibo Bergeron","Yolanda García Serrano","Carlos Marques-Marcet"];
		$scope.actors=["Peter Sellers","Paul Newman","Kodi Smit-McPhee","Seth MacFarlane","Mark Hamill","Ashton Kutcher","Mark Wahlberg","Claudia Cardinale","Paul Rudd","Jay Brazeau","Will Smith","Ewan McGregor","Roscoe Lee Browne","Thomas Doret","Andy Samberg","Sean Penn","Jack Black","Dax Shepard","Sally Hawkins","Qi Shu","Adam Sandler","James Caan","Michael Baden","Simon Pegg","Chris Pine","André Wilms","Patrick Stewart","William Shatner","Cameron Diaz","Sanaa Lathan","Bill Nighy","Hideaki Itô","Jane Levy","John Turturro","Geoffrey Rush","Gerard Butler","Rene Russo","Sullivan Stapleton","Jake Gyllenhaal","John Travolta","Matt Dillon","Keir Dullea","Ron Livingston","James Franco","Morton Downey Jr.","Philip Seymour Hoffman","Domhnall Gleeson","Errol Flynn","Jonah Bobo","Florence Muller","Katherine Sigismund","Isabelle Corey","Clint Eastwood","Erica Linz","William Hurt","Jim Carrey","Jamie Bell","Bruce Willis","John Neville","Hugo Weaving","James Gandolfini","Taylor Lautner","Tim Curry","Alexandra Dahlström","Johnny Depp","Imran Khan","Bruce Campbell","Tom Cruise","Robin Williams","Jeff Goldblum","Brandon Auret","Vanessa Paradis","Sarah Polley","Andy Serkis","Val Kilmer","Jessica Biel","Tom Skerritt","Sigourney Weaver","Jaden Smith","Ben Stiller","Zachary Gordon","Kôichi Yamadera","Leslie Nielsen","Ryan Phillippe","Guillermo Toledo","Ed Harris","Marilyn Burns","Jordana Brewster","Philippe Noiret","Clive Owen","Steve Zahn","Justin Timberlake","Keanu Reeves","Natalia Tena","Paul Reubens","Jaime Pressly","Emile Hirsch","Tim Allen","Dustin Hoffman","Kevin Bacon","Tobin Bell","Ben Affleck","Max Records","Uma Thurman","Reese Witherspoon","Darío Grandinetti","Ben Tibber","Alice Eve","Quvenzhané Wallis","Jamie Foxx","Jennifer Lopez","Damián Alcázar","Jamel Debbouze","Abigail Breslin","Jennifer Tilly","Leonardo DiCaprio","Dwayne Johnson","Antonio Banderas","John Cusack","Andy Garcia","Brendan Fraser","Katie Holmes","William Mapother","Richard Gere","Al Pacino","Julia Roberts","Parker Posey","Steve Martin","James Le Gros","Emma Shorey","Helen Mirren","Phoebe Fox","Pollyanna McIntosh","Natalie Portman","Harrison Ford","Scarlett Johansson","Bill Pullman","Jason Patric","Michael J. Fox","Ron Perlman","Christian Slater","Martin Lawrence","Caroline Ducey","Miki Mizuno","Isabelle Huppert","Robert De Niro","Zach Braff","Levi Stubbs","Jeff Bridges","Nicolas Cage","Jason Schwartzman","Dan Futterman","Romain Duris","Scott Adsit","Tom Hanks","Nia Vardalos","Amy Adams","Matthew McConaughey","Michelle Nolden","Guy Pearce","Chris Pratt","Aamir Khan","Daniel Craig","Michael Nyqvist","Winona Ryder","Daniel Giménez Cacho","Ryan Gosling","Colin Firth","Arnold Schwarzenegger","Bill Murray","Dennis Quaid","Denzel Washington","Matthew Broderick","Chris Hemsworth","Pierce Brosnan","Michelle Williams","Brad Pitt","Donnie Yen","Michael Cera","Katherine Heigl","Russell Crowe","Mike Myers","Trey Parker","Jack Nicholson","Thora Birch","Josh Hartnett","Steve Carell","Jeff Daniels","Robert Mitchum","Tommy Lee Jones","Anton Yelchin","Julianne Côté","Joaquin Phoenix","Robert Downey Jr.","Liam Neeson","Henry Cavill","Andrew Garfield","Tobey Maguire","Ben Whishaw","Vince Vaughn","Keir Gilchrist","Barret Oliver","François Cluzet","Melinda Dillon","Sissy Spacek","Suraj Sharma","Jean Reno","Roberto Benigni","Graham Chapman","Dave Foley","Angelina Jolie","Vin Diesel","Will Ferrell","Kevin Kline","Steve Railsback","Perdita Weeks","Asta Paredes","Hitomi Satô","Naomi Watts","Jay Baruchel","Fred A. Leuchter Jr.","Steven Strait","Kristin Kreuk","Chae Gil Byung","John C. Reilly","Judy Garland","Catherine Zeta-Jones","Fairuza Balk","Linus Torvalds","Jared Leto","Matt Damon","George Clooney","Krysten Ritter","Kevin Costner","Emma Thompson","Jake Johnson","Rowan Atkinson","Freda Kelly","John Cho","Chloë Grace Moretz","Kyle Catlett","Guillaume Canet","Daniel Radcliffe","George Pistereanu","Bradley Cooper","Toni Servillo","Wesley Snipes","Catherine Borek","Al Gore","Kevin Spacey","Anne Parillaud","Marion Cotillard","Marcello Mastroianni","Cecilia Roth","Eddie Murphy","Owen Wilson","Branko Djuric","Gregory Abbey","John Krasinski","Carey Mulligan","Nicole Kidman","Burt Reynolds","Kate Hudson","George W. Bush","J.J. Abrams","David Duchovny","Atta Yaqub","Daniel Day-Lewis","Weiwei Ai","Tilda Swinton","Haley Joel Osment","Lao Ai","Alex Pettyfer","Robert Redford","Dries Vanhegen","Dee Wallace","Anne Wiazemsky","Jean Gabin","Ian McKellen","Joe Belcher","Jeremy Davies","Carlos Gallardo","Gael García Bernal","Concha Velasco"];
		$scope.genres=["Drama","Biography","Comedy","Action","Western","Adventure","Documentary","Animation","Mystery","Horror","Crime","Fantasy","Sci-i","Family"];
		$scope.countries=["UK", "USA", "Italy", "New Zealand", "China", "France", "Australia", "Sweden", "Spain", "Belgium", "Japan", "Germany", "Argentina", "Mexico", "India", "West Germany", "Canada", "Romania", "Ireland", "South Africa", "Bosnia and Herzegovina", "Finland", "Denmark"];
		$scope.directors.sort();
		$scope.actors.sort();
		$scope.genres.sort();
		$scope.countries.sort();
		$scope.fetch = function(){
			console.log($scope.p);
			$http({
				url:'/getDirector',
				method:'POST',
				data:{
					director: $scope.p.Director,
					actor:$scope.p.Actor,
					genre:$scope.p.Genre
				}
			}).success(function(data){
				if(data.statusCode==200)
				{
					$scope.value = data.result;
				}
				else {
					console.log("darn");
				}

			}).error(function(error){

				console.log("try somthing elsel");
			});
		};

		$scope.test = 40;

//$scope.test2 = "val"
		$scope.chart = function(pRating)
		{
			var data = [
				{
					value: pRating,
					color:"#0066cc",
					label:"Success Rate"
				},
				{
					value: 100-pRating,
					color: "#ffffff",
					label: "Failure Rate"
				}

			];

			var options = {
				segmentShowStroke : false,
				animateScale : false,
				animateRotate: true,
				percentageInnerCutout: 50,
				tooltipTemplate:"<%=value%>%"
			}

			var ctx = document.getElementById("myChart").getContext("2d");
			var myNewChart = new Chart(ctx).Doughnut(data,options);
			document.getElementById('js-legend').innerHTML = myNewChart.generateLegend();

		};


		$scope.average = "";
		$scope.getResults = function(item){

			$http({
				url:'/getResults',
				method:'POST',
				data:{
					director: item.Director,
					actor:item.Actor,
					genre:item.Genre

				}
			}).success(function(data){
				if(data.statusCode===200)
				{
					//ToDo : call chart function to genreate graph
					$scope.average=data.result[0].success*10;
					$scope.chart($scope.average);
				}
			}).error(function(error){
				console.log("get result error ")
			});
		};



	}];


var    ResultsCtrl = ['$scope',   '$modalInstance',  'rspHeader', 'rspData',
	function ResultsCtrl($scope,   $modalInstance, rspHeader, rspData) {
		$scope.rspHeader = rspHeader;
		$scope.rspData = rspData;

		$scope.cancel  =  function() {
			$modalInstance.dismiss();
		}

		$scope.predChart = function(pRating)
		{
			var data = [
				{
					value: pRating*10,
					color:"#0066cc",
					label:"Rate of Success"
				},
				{
					value: 100-(pRating*10),
					color: "#ffffff",
					label: "Rate of failure"
				}

			];

			var options = {
				segmentShowStroke : false,
				animateScale : false,
				animateRotate: true,
				percentageInnerCutout: 50,
				tooltipTemplate:"<%=value%>%"
			}

			var ctx1 = document.getElementById("predChart").getContext("2d");
			var myNewChart1 = new Chart(ctx1).Doughnut(data,options);
			document.getElementById('pred-legend').innerHTML = myNewChart1.generateLegend();

		};

	}]

var    ErrorCtrl = ['$scope', '$modalInstance',  'msgTitle',    'message',
	function ErrorCtrl($scope, $modalInstance,    msgTitle,  message) {

		$scope.msgTitle    =  msgTitle;
		$scope.message = message;

		$scope.cancel  =  function() {
			$modalInstance.dismiss();
		};


	}]

drug1nSample.controller("AppCtrl", AppCtrl);
drug1nSample.controller("ResultsCtrl", ResultsCtrl);
drug1nSample.controller("ErrorCtrl", ErrorCtrl);