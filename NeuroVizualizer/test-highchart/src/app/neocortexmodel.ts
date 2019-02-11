
export class CellId {

  public area: number;

  public minicolumn: number[];

  public layer: number;
}

export class NeocortexSettings {

  public cellHeightInMiniColumn: number = 5;
  public miniColumnWidth: number = 5;
  public areaLevels: Array<number> = [0, 0, 0, 1, 1, 2];
  public minicolumnDims: number[];
  public numLayers: number;
  public xAreaDistance: number = 30;
  public yAreaDistance: number = 10;
  public zAreaDistance: number = 1;
  public defaultOverlapValue: number = 0;

}

export class NeoCortexModel {

  public areas: Array<Area>;

  public synapses: Array<Synapse>;

  public settings: NeocortexSettings;

  /**
   * Multidimensional sensory input.
   */
  public input: InputModel;


  constructor(settings: NeocortexSettings = null, input: InputModel = null, X = 0, Y = 0, Z = 0, synapses = []) {

    this.synapses = new Array();
    this.settings = settings;
    this.input = input;
    this.areas = new Array(settings.areaLevels.length);
    this.synapses = synapses;

    let areaId: number = 0;
    for (var levelIndx = 0; levelIndx < settings.areaLevels.length; levelIndx++) {

      this.areas[levelIndx] = new Area(settings, areaId, settings.areaLevels[levelIndx], X, Y, Z);

      // posX = posX + settings.xAreaDistance;
      // posY = posY + settings.yAreaDistance;
      // posZ = posZ + settings.zAreaDistance;

    }
    /*  let preCellIn: any;
     let postCellIn: any;
     for (preCellIn = 0; preCellIn < preCellsArray.length; preCellIn++) {
       for (postCellIn = 0; postCellIn < postCellsArray.length; postCellIn++) {
 
         this.synapses[preCellIn] = new Synapse(null, 0, preCellsArray[preCellIn], postCellsArray[preCellIn]);
 
       }
 
     } */

  }
}


export class Area {

  public minicolumns: Minicolumn[][] = new Array();
  public level: number;
  public id: number;

  constructor(settings: NeocortexSettings, areaId: number, level: number, X: number, Y: number, Z: number) {

    this.id = areaId;
    this.level = level;
    let miniColDim0: any; let miniColDim1: any;

    for (miniColDim0 = 0; miniColDim0 < settings.minicolumnDims[0]; miniColDim0++) {
      let row: Array<Minicolumn> = new Array();
      for (miniColDim1 = 0; miniColDim1 < settings.minicolumnDims[1]; miniColDim1++) {
        row.push(new Minicolumn(settings, areaId, [this.id, miniColDim0, miniColDim1], settings.defaultOverlapValue, (miniColDim0), (miniColDim1), Y));
      }


      this.minicolumns.push(row);

    }
  }
}

export class Minicolumn {

  public overlap: number;

  public cells: Array<Cell> = new Array();

  public id: number[];

  public areaId: number;
  preSynapse: Synapse;
  postSynapse: Synapse;

  private settings: NeocortexSettings;

  constructor(settings: NeocortexSettings, areaId: number, miniColId: number[], overlap: number, X: number, Y: number, Z: number) {

    this.areaId = areaId;
    this.overlap = overlap;
    this.id = miniColId;
    this.settings = settings;

    for (let layer = 0; layer < settings.numLayers; layer++) {

      let cell: Cell = new Cell(settings, areaId, miniColId, layer, X, Y, Z, null, null)

      this.cells.push(cell);
    }
  }
}


/**
 * 
 */
export class Cell {

  public X: number;
  public Y: number;
  public Z: number;

  public id: CellId;
  public Layer: number;
  incomingSynapses: Array<Synapse> = new Array();
  outgoingSynapses: Array<Synapse> = new Array();

  /**
   * 
   * @param layer Optional for input model.
   * @param posX 
   * @param posY 
   * @param posZ 
   */
  constructor(settings: NeocortexSettings, areaId: number, miniColId: number[], layer: number, X: number = 0, Y: number = 0, Z: number = 0, incomingSynap :Array<Synapse>, outgoingSynap : Array<Synapse>) {
    this.Layer = layer;
    this.X = X;
    this.Y = Y;
    this.Z = Z;
    this.id = { area: areaId, minicolumn: miniColId, layer: layer };
    this.incomingSynapses = incomingSynap;
    this.outgoingSynapses = outgoingSynap;

  }
}


export class Synapse {

  public id: number;

  public preSynaptic: Cell;

  public postSynaptic: Cell;

  public permanence: number;

  constructor(id: number, permanence: number = 0, preSynaptic: Cell, postSynaptic: Cell) {
    this.preSynaptic = preSynaptic;
    this.postSynaptic = postSynaptic;
    this.permanence = permanence;
    this.id = id;
  }
}


export class InputModel {

  public cells: Cell[][] = new Array();

  public id: number;

  constructor(settings: NeocortexSettings, cellDims: number[] = []) {

    this.cells = new Array();

    //TODO. Exception if cellDims > 2
    try {

      for (var dim = 0; dim < cellDims.length; dim++) {
        let row: Array<Cell> = new Array();
        for (var i = 0; i < cellDims[dim]; i++) {
          row.push(new Cell(settings, this.id, [dim, i], null, null, null, null, null, null));
        }

      }

      for (var dim = 0; dim < cellDims[0]; dim++) {

        let row: Array<Cell> = new Array();

        for (var j = 0; j < cellDims[1]; j++) {

          //row.push(new Cell(settings, 0, [i, j], 0));
          row.push(new Cell(settings, this.id, [dim, j], null, null, null, null, null, null));
        }

        this.cells.push(row);
      }
    }
    catch (e) {
      console.log(e);
    }


  }
}



