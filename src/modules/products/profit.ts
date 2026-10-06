export interface CostPlan {shipping:number;cod:number;rto:number;payment:number;marketing:number}
export function economics(supplierPrice:number,retailPrice:number,costs:CostPlan){
 const values=[supplierPrice,retailPrice,...Object.values(costs)];
 if(values.some(v=>!Number.isFinite(v)||v<0)||retailPrice===0)throw new Error("Enter valid non-negative costs and a positive retail price.");
 const landed=supplierPrice+costs.shipping+costs.cod+costs.rto+costs.payment+costs.marketing;
 return {landed,contribution:retailPrice-landed,margin:Math.round((retailPrice-landed)/retailPrice*1000)/10};
}
