import { convertInstructionGroupsToSummaryList } from '../src/services/messaging'

function addIndexNull(instructions: any[]) {
  return instructions.map((instruction: any) => ({
    index: null,
    ...instruction,
  }))
}

test('2 instruction groups with 1 entity in each ', () => {
  const instructions = [
    [
      {
        address: {
          name: 'Kellgrensgatan 14, Stockholm, Sweden',
        },
        id: 'pmb-ztziodmw',
        type: 'pickupShipment',
      },
    ],
    [
      {
        address: {
          name: 'Storgatan 59, Stockholm, Sweden',
        },
        id: 'pmb-ztziodmw',
        type: 'deliverShipment',
      },
    ],
  ].map(addIndexNull)
  const res = convertInstructionGroupsToSummaryList(instructions)

  expect(res).toBe(`🎁  Här är dina körningar:
1\. Hämta __ODMW__ vid Kellgrensgatan 14, Stockholm, Sweden
2\. Lämna __ODMW__ vid Storgatan 59, Stockholm, Sweden`)
})

test('2 instruction groups with 1 entity, 1 instruction group with 2 entities', () => {
  const instructions = [
    [
      {
        address: {
          name: 'Kellgrensgatan 14, Stockholm, Sweden',
        },
        id: 'pmb-ztziodmw',
        type: 'pickupShipment',
      },
    ],
    [
      {
        address: {
          name: 'Åkerivägen 3, Sweden',
        },
        id: 'pmb-zgy4njdj',
        type: 'pickupShipment',
      },
    ],
    [
      {
        address: {
          name: 'Storgatan 59, Stockholm, Sweden',
        },
        id: 'pmb-ztziodmw',
        type: 'deliverShipment',
      },
      {
        address: {
          name: 'Storgatan 59, Stockholm, Sweden',
        },
        id: 'pmb-zgy4njdj',
        type: 'deliverShipment',
      },
    ],
  ].map(addIndexNull)
  const res = convertInstructionGroupsToSummaryList(instructions)

  expect(res).toBe(`🎁  Här är dina körningar:
1\. Hämta __ODMW__ vid Kellgrensgatan 14, Stockholm, Sweden
2\. Hämta __NJDJ__ vid Åkerivägen 3, Sweden
3\. Lämna __ODMW__, __NJDJ__ vid Storgatan 59, Stockholm, Sweden`)
})

test('2 instruction group with 2 entities, 1 instruction group with 1 ', () => {
  const instructions = [
    [
      {
        address: {
          name: 'Kellgrensgatan 14, Stockholm, Sweden',
        },
        id: 'pmb-ztziodmw',
        type: 'pickupShipment',
      },
      {
        address: {
          name: 'Kellgrensgatan 14, Stockholm, Sweden',
        },
        id: 'pmb-mjgynwiy',
        type: 'pickupShipment',
      },
    ],
    [
      {
        address: {
          name: 'Storgatan 59, Stockholm, Sweden',
        },
        id: 'pmb-ztziodmw',
        type: 'deliverShipment',
      },
      {
        address: {
          name: 'Storgatan 59, Stockholm, Sweden',
        },
        id: 'pmb-mjgynwiy',
        type: 'deliverShipment',
      },
    ],
    [
      {
        address: {
          name: 'Åkerivägen 3, Sweden',
        },
        id: 'pmb-zgy4njdj',
        type: 'pickupShipment',
      },
    ],
    [
      {
        address: {
          name: 'Stockholmsvägen 8, Sweden',
        },
        id: 'pmb-zgy4njdj',
        type: 'deliverShipment',
      },
    ],
  ].map(addIndexNull)
  const res = convertInstructionGroupsToSummaryList(instructions)

  expect(res).toBe(`🎁  Här är dina körningar:
1\. Hämta __ODMW__, __NWIY__ vid Kellgrensgatan 14, Stockholm, Sweden
2\. Lämna __ODMW__, __NWIY__ vid Storgatan 59, Stockholm, Sweden
3\. Hämta __NJDJ__ vid Åkerivägen 3, Sweden
4\. Lämna __NJDJ__ vid Stockholmsvägen 8, Sweden`)
})
