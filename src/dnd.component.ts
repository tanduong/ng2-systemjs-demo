// Copyright (C) 2016 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg

'use strict';

import {Component, Injectable} from '@angular/core';
import {COMMON_DIRECTIVES} from '@angular/common';

import {DND_DIRECTIVES} from 'ng2-dnd';

@Component({
    selector: 'demo-dnd',
    directives: [COMMON_DIRECTIVES, DND_DIRECTIVES],
    template: `
<div class="container">
    <div>
        <h4>Simple Drag-and-Drop</h4>
        <div class="row">
            <div class="col-sm-3">
                <div class="panel panel-success">
                    <div class="panel-heading">Available to drag</div>
                    <div class="panel-body">
                        <div class="panel panel-default" dnd-draggable [dragEnabled]="true">
                            <div class="panel-body">
                                <div>Drag Me</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-3">
                <div dnd-droppable class="panel panel-info" (onDropSuccess)="simpleDrop=$event">
                    <div class="panel-heading">Place to drop</div>
                    <div class="panel-body">
                    	<div *ngIf="simpleDrop">Item was dropped here</div>
                    </div>
                </div>
            </div>
        </div>

        <h4>Restricted Drag-and-Drop with zones</h4>
        <div class="row">
            <div class="col-sm-3">
                <div class="panel panel-primary">
                    <div class="panel-heading">Available to drag</div>
                    <div class="panel-body">
                        <div class="panel panel-default" dnd-draggable [dragEnabled]="true" [dropZones]="['zone1']">
                            <div class="panel-body">
                                <div>Drag Me</div>
                                <div>Zone 1 only</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="panel panel-success">
                    <div class="panel-heading">Available to drag</div>
                    <div class="panel-body">
                        <div class="panel panel-default" dnd-draggable [dragEnabled]="true" [dropZones]="['zone1', 'zone2']">
                            <div class="panel-body">
                                <div>Drag Me</div>
                                <div>Zone 1 & 2</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-3">
                <div dnd-droppable class="panel panel-info" [dropZones]="['zone1']" (onDropSuccess)="restrictedDrop1=$event">
                    <div class="panel-heading">Zone 1</div>
                    <div class="panel-body">
                      <div *ngIf="restrictedDrop1">Item was dropped here</div>
                    </div>
                </div>
            </div>
            <div class="col-sm-3">
                <div dnd-droppable class="panel panel-warning" [dropZones]="['zone2']" (onDropSuccess)="restrictedDrop2=$event">
                    <div class="panel-heading">Zone 2</div>
                    <div class="panel-body">
                      <div *ngIf="restrictedDrop2">Item was dropped here</div>
                    </div>
                </div>
            </div>
        </div>

        <h4>Transfer custom data in Drag-and-Drop</h4>
        <div class="row">
            <div class="col-sm-3">
                <div class="panel panel-success">
                    <div class="panel-heading">Available to drag</div>
                    <div class="panel-body">
                        <div class="panel panel-default" dnd-draggable [dragEnabled]="true" [dragData]="transferData">
                            <div class="panel-body">
                                <div>Drag Me</div>
                                <div>{{transferData | json}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-3">
                <div dnd-droppable class="panel panel-info" (onDropSuccess)="transferDataSuccess($event)">
                    <div class="panel-heading">Place to drop (Items:{{receivedData.length}})</div>
                    <div class="panel-body">
                        <div [hidden]="!receivedData.length > 0" *ngFor="let data of receivedData">{{data | json}}</div>
                    </div>
                </div>
            </div>
        </div>

        <h4>Drag-and-Drop - Shopping basket</h4>
        <div class="row">

            <div class="col-sm-3">
                <div class="panel panel-success">
                    <div class="panel-heading">Available products</div>
                    <div class="panel-body">
                        <div *ngFor="let product of availableProducts" class="panel panel-default"
                            dnd-draggable [dragEnabled]="product.quantity>0" [dragData]="product" (onDragSuccess)="orderedProduct($event)" [dropZones]="['demo1']">
                            <div class="panel-body">
                                <div [hidden]="product.quantity===0">{{product.name}} - \${{product.cost}}<br>(available: {{product.quantity}})</div>
                                <div [hidden]="product.quantity>0"><del>{{product.name}}</del><br>(NOT available)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-3">
                <div dnd-droppable (onDropSuccess)="addToBasket($event)" [dropZones]="['demo1']" class="panel panel-info">
                    <div class="panel-heading">Shopping Basket<br>(to pay: \${{totalCost()}})</div>
                    <div class="panel-body">
                        <div *ngFor="let product of shoppingBasket" class="panel panel-default">
                            <div class="panel-body">
                            {{product.name}}<br>(ordered: {{product.quantity}}<br>cost: \${{product.cost * product.quantity}})
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <h4>Simple sortable</h4>
        <div class="row">
            <div class="col-sm-3">
                <div class="panel panel-success">
                    <div class="panel-heading">
                        Favorite drinks
                    </div>
                    <div class="panel-body">
                        <ul class="list-group" dnd-sortable-container [sortableData]="listOne">
                            <li *ngFor="let item of listOne; let i = index" class="list-group-item" dnd-sortable [sortableIndex]="i">{{item}}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="panel panel-default">
                    <div class="panel-body">
                        My prefences:<br/>
                        <span *ngFor="let item of listOne; let i = index">{{i + 1}}) {{item}}<br/></span>
                    </div>
                </div>
            </div>
        </div>

        <h4>Multi list sortable</h4>
        <div class="row">
            <div class="col-sm-3">
            <div class="panel panel-warning">
                <div class="panel-heading">
                Available boxers
                </div>
                <div class="panel-body" dnd-sortable-container [dropZones]="['boxers-zone']" [sortableData]="listBoxers">
                <ul class="list-group" >
                    <li *ngFor="let item of listBoxers; let i = index" class="list-group-item" dnd-sortable [sortableIndex]="i">{{item}}</li>
                </ul>
                </div>
            </div>
            </div>
            <div class="col-sm-3">
            <div class="panel panel-success">
                <div class="panel-heading">
                First Team
                </div>
                <div class="panel-body" dnd-sortable-container [dropZones]="['boxers-zone']" [sortableData]="listTeamOne">
                <ul class="list-group" >
                    <li *ngFor="let item of listTeamOne; let i = index" class="list-group-item" dnd-sortable [sortableIndex]="i">{{item}}</li>
                </ul>
                </div>
            </div>
            </div>
            <div class="col-sm-3">
            <div class="panel panel-info">
                <div class="panel-heading">
                Second Team
                </div>
                <div class="panel-body" dnd-sortable-container [dropZones]="['boxers-zone']" [sortableData]="listTeamTwo">
                <ul class="list-group">
                    <li *ngFor="let item of listTeamTwo; let i = index" class="list-group-item" dnd-sortable [sortableIndex]="i">{{item}}</li>
                </ul>
                </div>
            </div>
            </div>
        </div>

        <h4>Simple sortable With Drop into recycle bin</h4>
        <div class="row">
            <div class="col-sm-3">
                <div class="panel panel-success">
                    <div class="panel-heading">
                        Favorite drinks
                    </div>
                    <div class="panel-body">
                        <ul class="list-group" dnd-sortable-container [sortableData]="listTwo" [dropZones]="['delete-dropZone']">
                            <li *ngFor="let item of listTwo; let i = index" class="list-group-item"
                            dnd-sortable [sortableIndex]="i">{{item}}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="panel panel-default">
                    <div class="panel-body"
                        dnd-sortable-container
                        [dropZones]="['delete-dropZone']"
                        [sortableData]="listRecycled">
                        Recycle bin: Drag into me to delete it<br/>
                    </div>
                </div>
                <div *ngIf="listRecycled.length">
                <b>Recycled:</b> <span>{{listRecycled.toString()}} </span>
                </div>
            </div>
        </div>

        <h4>Simple sortable With Drop into something, without delete it</h4>
        <div class="row">
            <div class="col-sm-3">
                Drag Containers <input type="checkbox" [(ngModel)]="dragOperation"/>
                <div dnd-sortable-container [sortableData]="containers" [dropZones]="['container-dropZone']">
                    <div class="col-sm3"
                            *ngFor="let container of containers; let i = index"
                            dnd-sortable [sortableIndex]="i" [dragEnabled]="dragOperation">
                        <div class="panel panel-warning"
                            dnd-sortable-container [sortableData]="container.widgets" [dropZones]="['widget-dropZone']">
                            <div class="panel-heading">
                                {{container.id}} - {{container.name}}
                            </div>
                            <div class="panel-body">
                                <ul class="list-group">
                                    <li *ngFor="let widget of container.widgets; let x = index" class="list-group-item"
                                        dnd-sortable [sortableIndex]="x" [dragEnabled]="!dragOperation"
                                        [dragData]="widget">{{widget.name}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="panel panel-info">
                    <div class="panel-heading">Widgets</div>
                    <div class="panel-body" dnd-droppable (onDropSuccess)="addTo($event)" [dropZones]="['widget-dropZone']">
                        <div *ngFor="let widget of widgets" class="panel panel-default">
                            <div class="panel-body">
                                {{widget.name}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</div>`
})
export class DndComponent {
    simpleDrop: any = null;
    restrictedDrop1: any = null;
    restrictedDrop2: any = null;

    transferData: Object = {id: 1, msg: 'Hello'};
    receivedData: Array<any> = [];

    availableProducts: Array<Product> = [];
    shoppingBasket: Array<Product> = [];

    listOne: Array<string> = ['Coffee', 'Orange Juice', 'Red Wine', 'Unhealty drink!', 'Water'];

    listBoxers: Array<string> = ['Sugar Ray Robinson', 'Muhammad Ali', 'George Foreman', 'Joe Frazier', 'Jake LaMotta', 'Joe Louis', 'Jack Dempsey', 'Rocky Marciano', 'Mike Tyson', 'Oscar De La Hoya'];
    listTeamOne: Array<string> = [];
    listTeamTwo: Array<string> = [];

    listTwo: Array<string> = ['Coffee', 'Orange Juice', 'Red Wine', 'Unhealty drink!', 'Water'];
    listRecycled: Array<string> = [];

    dragOperation: boolean = false;

    containers: Array<Container> = [
        new Container(1, 'Container 1', [new Widget('1'), new Widget('2')]),
        new Container(2, 'Container 2', [new Widget('3'), new Widget('4')]),
        new Container(3, 'Container 3', [new Widget('5'), new Widget('6')])
    ];

    widgets: Array<Widget> = [];
    addTo($event) {
        if ($event) {
            this.widgets.push($event.dragData);
        }
    }

    constructor() {
        this.availableProducts.push(new Product('Blue Shoes', 3, 35));
        this.availableProducts.push(new Product('Good Jacket', 1, 90));
        this.availableProducts.push(new Product('Red Shirt', 5, 12));
        this.availableProducts.push(new Product('Blue Jeans', 4, 60));
    }

    orderedProduct($event) {
        let orderedProduct: Product = $event.dragData;
        orderedProduct.quantity--;
    }

    addToBasket($event) {
        let newProduct: Product = $event.dragData;
        for (let indx in this.shoppingBasket) {
            let product: Product = this.shoppingBasket[indx];
            if (product.name === newProduct.name) {
                product.quantity++;
                return;
            }
        }
        this.shoppingBasket.push(new Product(newProduct.name, 1, newProduct.cost));
        this.shoppingBasket.sort((a: Product, b: Product) => {
            return a.name.localeCompare(b.name);
        });
    }

    totalCost(): number {
        let cost: number = 0;
        for (let indx in this.shoppingBasket) {
            let product: Product = this.shoppingBasket[indx];
            cost += (product.cost * product.quantity);
        }
        return cost;
    }

    transferDataSuccess($event) {
        this.receivedData.push($event);
    }
}

class Product {
  constructor(public name: string, public quantity: number, public cost: number) {}
}

class Container {
  constructor(public id: number, public name: string, public widgets: Array<Widget>) {}
}

class Widget {
  constructor(public name: string) {}
}
