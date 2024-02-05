export function getPrompts(data)
{
  const res = [];
  if(data)
  {
    for(let i = 0; i < data.length; i++)
    {
      const chunk = data[i];
      console.log(chunk);
      const prompt = {
        _action: "AddMedicine",
        _execute: "send",
        Name: chunk.name,
        ID: chunk.id,
        Price: chunk.price,
        Type: chunk.type,
        Available: chunk.available,
        ManufacturedBy: chunk.manufacturer_name,
        Composition: chunk.short_composition,
        SkuId: chunk.sku_id
      };
      res.push(prompt);
    }
  }

  return res;
}
