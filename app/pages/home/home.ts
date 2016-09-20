import { Component } from '@angular/core';
import {PostDetail} from '../post-detail/post-detail';
import { NavController, NavParams } from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
	url: string = 'https://apppresser.com/wp-json/wp/v2/posts';
	items: any;
	page: any;

	constructor(public navCtrl: NavController, private http: Http, private nav: NavController ) {
	}

	ionViewDidEnter() {

		this.page = '1';

		this.loadPosts( this.page ).then( data => {
			console.log('Posts loaded', data);
			this.items = data;
		});
	}

	loadPosts( page ) {

		if( !page ) {
	      let page = '1';
	    }

		return new Promise(resolve => {

			this.http.get( this.url + '?page=' + page )
		    .map(res => res.json())
		    .subscribe(data => {
		      // we've got back the raw data, now generate the core schedule data
		      // and save the data for later reference
		      resolve( data );
		    });

		});
	}

	itemTapped(event, item) {
		this.nav.push(PostDetail, {
		  item: item
		});
	}

	loadMore(infiniteScroll) {

	    this.page++;

	    this.loadPosts( this.page ).then( items => {
	      // Loads posts from WordPress API
	      let length = items["length"];

	      if( length === 0 ) {
	        infiniteScroll.complete();
	        return;
	      }

	      for (var i = length - 1; i >= 0; i--) {
	        this.items.push( items[i] );
	      }

	      infiniteScroll.complete();
	    });
	}
}
