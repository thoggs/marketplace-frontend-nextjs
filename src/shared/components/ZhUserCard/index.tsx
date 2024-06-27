import { Avatar, Button, Card, Group, Text } from "@mantine/core";
import React from "react";
import { useSession } from "next-auth/react";

export default function ZhUserCard() {
  const session = useSession();

  return (
    <Card withBorder radius='md' p='xs'>
      <Card.Section withBorder inheritPadding pt='md' pb='xs'>
        <Group justify='flex-start' gap='xs'>
          <Avatar src={session.data?.picture}/>
          <Text fw={500}>
            {session.data?.user.data.user.firstName} {session.data?.user.data.user.lastName}
          </Text>
        </Group>
      </Card.Section>
      <Button variant='transparent'>
        <Text mt='sm' c='dimmed' size='sm'>{session.data?.user.data.user.email}</Text>
      </Button>
    </Card>
  );
}
