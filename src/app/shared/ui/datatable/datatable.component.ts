import {Component, Input, ElementRef, AfterContentInit, OnInit, Output, EventEmitter} from '@angular/core';

declare var $: any;

@Component({

  selector: 'sa-datatable',
  template: `
      <table class="dataTable {{tableClass}}" width="{{width}}">
        <ng-content></ng-content>
      </table>
`,
  styles: [
    require('smartadmin-plugins/datatables-bundle/datatables.min.css')
  ]
})
export class DatatableComponent implements OnInit {

  @Input() public options:any;
  @Input() public filter:any;
  @Input() public detailsFormat:any;

  @Input() public paginationLength: boolean;
  @Input() public columnsHide: boolean;
  @Input() public tableClass: string;
  @Input() public width: string = '100%';

  @Output() btnViewClicked = new EventEmitter();
  @Output() btnEditClicked = new EventEmitter();
  @Output() btnOther1Clicked = new EventEmitter();
  @Output() btnOther2Clicked = new EventEmitter();
  @Output() btnOther3Clicked = new EventEmitter();

  dataTableRef: any;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    Promise.all([
      System.import('script!smartadmin-plugins/datatables-bundle/datatables.min.js'),
    ]).then(()=>{
      this.render()
    })
  }

  refreshData(url:any) {    
    this.dataTableRef.ajax.url(url).load();
  }

  render() {
    let element = $(this.el.nativeElement.children[0]);
    let options = this.options || {}


    let toolbar = '';
    if (options.buttons)
      toolbar += 'B';
    if (this.paginationLength)
      toolbar += 'l';
    if (this.columnsHide)
      toolbar += 'C';

    if (typeof options.ajax === 'string') {
      let url = options.ajax;
      options.ajax = {
        url: url,
        // complete: function (xhr) {
        //
        // }
      }
    }

    options = $.extend(options, {

      "dom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs text-right'" + toolbar + ">r>" +
      "t" +
      "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
      oLanguage: {
        "sSearch": "<span class='input-group-addon'><i class='glyphicon glyphicon-search'></i></span>",
        "sLengthMenu": "_MENU_"
      },
      "autoWidth": false,
      retrieve: true,
      responsive: true,
      initComplete: (settings, json)=> {
        element.parent().find('.input-sm', ).removeClass("input-sm").addClass('input-md');
      }
    });
    
    const _dataTable = element.DataTable(options);

     if (!this.dataTableRef) {
       this.dataTableRef = _dataTable;
     }

    if (this.filter) {
      // Apply the filter
      element.on('keyup change', 'thead th input[type=text]', function () {
        _dataTable
          .column($(this).parent().index() + ':visible')
          .search(this.value)
          .draw();
      });
    }


    if (!toolbar) {
      element.parent().find(".dt-toolbar")
        .append(`<div class="text-right"></div>`);
    }

    if(this.detailsFormat){
      let format = this.detailsFormat
      element.on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = _dataTable.row( tr );
        if ( row.child.isShown() ) {
          row.child.hide();
          tr.removeClass('shown');
        }
        else {
          row.child( format(row.data()) ).show();
          tr.addClass('shown');
        }
      })
    }

    // Handle click on "View" button
    let self = this;

    element.on('click', '.btn-view', function (e) {
        var tr = $(this).closest('tr');
        var row = _dataTable.row( tr );
        var data = row.data();         
               
        self.btnViewClicked.emit(data);
    } );

    element.on('click', '.btn-edit', function (e) {
        var tr = $(this).closest('tr');
        var row = _dataTable.row( tr );
        var data = row.data();         
               
        self.btnEditClicked.emit(data);
    } );

    element.on('click', '.btn-other1', function (e) {
        var tr = $(this).closest('tr');
        var row = _dataTable.row( tr );
        var data = row.data();         
               
        self.btnOther1Clicked.emit(data);
    } );

    element.on('click', '.btn-other2', function (e) {
        var tr = $(this).closest('tr');
        var row = _dataTable.row( tr );
        var data = row.data();         
               
        self.btnOther2Clicked.emit(data);
    } );

    element.on('click', '.btn-other3', function (e) {
        var tr = $(this).closest('tr');
        var row = _dataTable.row( tr );
        var data = row.data();         
               
        self.btnOther3Clicked.emit(data);
    } );

  }

}
