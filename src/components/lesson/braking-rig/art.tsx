import { fitProjection, boxCorners, slabOf, iso, sideMatrix, translateAlong, type SolidPaths } from './iso-kit';

// Parts: 4 feet, bed, 2 rails, 12 rail chairs, 24 fasteners, 2 stops,
// ruler, instrument base, 2 uprights, crossbar, dial housing/bezel/glass,
// counter housing/5 drums, 2 axles, 4 wheels/hubs, chassis, deck,
// 4 deck bolts, actuator bracket/plunger/shoe/lining and 6 cooling slots.
export const projection = fitProjection([
  ...boxCorners({ x: 0, y: 0, w: 640, d: 170, r: 6 }, -15, 0),
  [240, 12, 190], [510, 12, 190],
], 940, 470, { pad: 36, azimuth: 64, elevation: 24 });
export const moveCart = (position: number) => translateAlong(projection, [position * 21, 0, 0]);
export const face = (x: number, y: number, z: number) => sideMatrix([x, y], z, projection, 'left');
const point = (x: number, y: number, z: number) => iso([x, y, z], projection);

function Solid({ paths, accent = false }: { paths: SolidPaths; accent?: boolean }) {
  return <g data-solid="" data-accent={accent || undefined}>
    <path d={paths.fill} fill={accent ? '#be5a38' : '#bbc1bd'} />
    {paths.shades.map((d, i) => <path key={i} d={d} fill={accent ? ['#a54329','#b44c2e','#cb6742','#da8259'][i] : ['#969f99','#adb5ae','#c7cdc6','#d9ddd5'][i]} />)}
    <path d={paths.top} fill={accent ? '#eab18f' : '#edf0e6'} />
    <path className="iso-line iso-edge" d={paths.outline} fill="none" stroke="#535e56" strokeWidth=".7" />
    <path className="iso-line iso-bevel" d={paths.bevel} fill="none" stroke="#fffdf5" strokeWidth=".65" />
  </g>;
}
function Block({ x, y, z, w, d, h, accent = false }: { x: number; y: number; z: number; w: number; d: number; h: number; accent?: boolean }) {
  return <Solid paths={slabOf({ x, y, w, d, r: 1.8 }, z, h, projection, 4, .6)} accent={accent}/>;
}
function Screw({ x, y, z }: { x: number; y: number; z: number }) {
  const [cx, cy] = point(x, y, z);
  return <g><ellipse cx={cx} cy={cy} rx="2.6" ry="1.6" fill="#768278" stroke="#f7f8ee" strokeWidth=".6"/><path className="iso-line" d={`M${cx-2},${cy}h4`} stroke="#38483e" strokeWidth=".65"/></g>;
}
export function Bench() {
  return <g>
    {[20, 600].flatMap(x => [16, 145].map(y => <Block key={`${x}-${y}`} x={x} y={y} z={-15} w={20} d={15} h={9}/>))}
    <Block x={0} y={0} z={-6} w={640} d={170} h={6}/>
    <Block x={225} y={8} z={0} w={280} d={34} h={5}/>
    {[245,470].map(x => <g key={x}><Block x={x} y={17} z={5} w={12} d={14} h={105}/><Block x={x-6} y={11} z={5} w={24} d={26} h={6}/><Screw x={x-2} y={18} z={11}/><Screw x={x+17} y={30} z={11}/></g>)}
    <Block x={235} y={14} z={105} w={260} d={18} h={10}/>
    <Block x={232} y={5} z={115} w={116} d={30} h={74}/>
    <Block x={365} y={5} z={130} w={143} d={30} h={50}/>
    {[66,121].map(y => <g key={y}>
      {[20,130,240,350,460,590].map(x => <g key={x}><Block x={x} y={y-9} z={0} w={26} d={22} h={5}/><Screw x={x+4} y={y-5} z={5}/><Screw x={x+22} y={y+9} z={5}/></g>)}
      <Block x={13} y={y} z={5} w={610} d={6} h={7}/>
    </g>)}
    {[10,615].map(x => <g key={x}><Block x={x} y={57} z={0} w={10} d={80} h={18}/><Screw x={x+5} y={62} z={18}/><Screw x={x+5} y={130} z={18}/></g>)}
    <Block x={25} y={148} z={0} w={585} d={12} h={1}/>
    {Array.from({length: 101}, (_, i) => {
      const a = point(30+i*5.7, 160, 1), b = point(30+i*5.7, 160-(i%5===0?9:4),1);
      return <path className="iso-line" key={i} d={`M${a}L${b}`} stroke="#6f7a70" strokeWidth={i%5===0?.8:.4}/>;
    })}
  </g>;
}
export function Wheel({ x, y }: { x: number; y: number }) {
  return <g transform={face(x,y,27)}>
    <circle r="15" fill="#45534a" stroke="#26382c" strokeWidth="2"/>
    <circle r="11.6" fill="#d5dacf" stroke="#849082" strokeWidth="1.4"/>
    <g data-wheel="">{[0,60,120].map(a => <path className="iso-line" key={a} transform={`rotate(${a})`} d="M-10,0H10" stroke="#778578" strokeWidth="2"/>)}</g>
    <circle r="4" fill="#eef0e6" stroke="#657363"/><circle r="1.6" fill="#4e5c51"/>
  </g>;
}
export function Cart({ shoeRef }: { shoeRef: React.Ref<SVGGElement> }) {
  return <g>
    <Wheel x={61} y={66}/><Wheel x={147} y={66}/>
    {[61,147].map(x => <Block key={x} x={x-3} y={66} z={24} w={6} d={62} h={6}/>)}
    <Block x={37} y={70} z={27} w={133} d={52} h={15}/>
    <Block x={32} y={65} z={42} w={143} d={63} h={5}/>
    {[43,162].flatMap(x => [75,118].map(y => <Screw key={`${x}-${y}`} x={x} y={y} z={47}/>))}
    <Block x={65} y={78} z={47} w={64} d={38} h={8}/>
    {Array.from({length:6},(_,i)=><Block key={i} x={70+i*9} y={82} z={55} w={3} d={29} h={1}/>)}
    <Wheel x={61} y={128}/><Wheel x={147} y={128}/>
    <Block x={163} y={114} z={45} w={12} d={22} h={20}/>
    <Block x={173} y={123} z={25} w={7} d={12} h={32}/>
    <g ref={shoeRef}>
      <Block x={165} y={126} z={25} w={9} d={8} h={5}/>
      <Block x={165} y={125} z={17} w={4} d={10} h={20} accent/>
      <Block x={163} y={126} z={19} w={2} d={8} h={16} accent/>
    </g>
  </g>;
}
