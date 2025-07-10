import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { GestionEvento } from './GestionEvento';
import { Usuario } from './Usuario';
@Table({ tableName: 'planificacionevento' })
export class PlanificacionEvento extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare IdPlanificarE: number;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare NombreEvento: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare FechaEvento: Date;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare LugarDeEvento: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare Recursos: string;

  @ForeignKey(() => GestionEvento)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare IdGestionE: number;
@Column({ type: DataType.STRING(100), allowNull: false })
declare TipoEvento: string;

  @BelongsTo(() => GestionEvento)
  declare gestionEvento: GestionEvento;
  @ForeignKey(() => Usuario)
@Column({ type: DataType.INTEGER, allowNull: false })
declare IdUsuario: number;

@BelongsTo(() => Usuario)
declare usuario: Usuario;

}
